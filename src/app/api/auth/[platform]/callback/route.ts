import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ platform: string }> }
) {
    const { platform } = await params;
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    if (!code) {
        return NextResponse.redirect(
            `${appUrl}/dashboard/accounts?error=no_code`
        );
    }

    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.redirect(`${appUrl}/login`);
    }

    try {
        let accessToken = "";
        let refreshToken = "";
        let platformUserId = "";
        let platformUsername = "";
        let tokenExpiresAt: string | null = null;

        const redirectUri = `${appUrl}/api/auth/${platform}/callback`;

        switch (platform) {
                case "tiktok": {
                    // Try to retrieve PKCE verifier from cookie keyed by state
                    const state = searchParams.get("state") || "";
                    const cookieHeader = request.headers.get("cookie") || "";
                    const parseCookies = (c: string) =>
                        Object.fromEntries(
                            c.split(";").map((pair) => {
                                const [k, ...v] = pair.split("=");
                                return [k?.trim(), decodeURIComponent(v.join("=") || "")];
                            })
                        );

                    const cookies = parseCookies(cookieHeader);
                    const codeVerifier = cookies[`tiktok_cv_${state}`];

                    const bodyParams: Record<string, string> = {
                        client_key: process.env.TIKTOK_CLIENT_KEY!,
                        client_secret: process.env.TIKTOK_CLIENT_SECRET!,
                        code,
                        grant_type: "authorization_code",
                        redirect_uri: redirectUri,
                    };

                    if (codeVerifier) {
                        bodyParams.code_verifier = codeVerifier;
                    }

                    const tokenRes = await fetch(
                        "https://open.tiktokapis.com/v2/oauth/token/",
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/x-www-form-urlencoded" },
                            body: new URLSearchParams(bodyParams),
                        }
                    );
                const tokenData = await tokenRes.json();

                // If token endpoint returned an error, log details and redirect with error
                if (!tokenData || tokenData.error || !tokenData.access_token) {
                    console.error(`[oauth][tiktok] token exchange failed:`, tokenData);
                    return NextResponse.redirect(`${appUrl}/dashboard/accounts?error=tiktok_token_failed`);
                }

                accessToken = tokenData.access_token;
                refreshToken = tokenData.refresh_token || "";
                platformUserId = tokenData.open_id;

                // Get user info
                const userRes = await fetch(
                    "https://open.tiktokapis.com/v2/user/info/?fields=display_name,avatar_url",
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                const userData = await userRes.json();
                platformUsername = userData.data?.user?.display_name || platformUserId;
                // Clear the PKCE verifier cookie after successful exchange
                try {
                    const res = NextResponse.redirect(`${appUrl}/dashboard/accounts?connected=${platform}`);
                    // delete cookie by setting maxAge=0
                    res.cookies.set(`tiktok_cv_${state}`, "", { path: "/", maxAge: 0 });
                    return res;
                } catch (err) {
                    console.error("[oauth][tiktok] error clearing cookie:", err);
                }
                break;
            }

            case "instagram": {
                // Exchange code for Facebook access token
                const tokenRes = await fetch(
                    `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${process.env.INSTAGRAM_APP_SECRET}&code=${code}`
                );
                const tokenData = await tokenRes.json();
                accessToken = tokenData.access_token;

                // Get Instagram business account
                const pagesRes = await fetch(
                    `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
                );
                const pagesData = await pagesRes.json();

                if (pagesData.data?.length > 0) {
                    const pageId = pagesData.data[0].id;
                    const igRes = await fetch(
                        `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
                    );
                    const igData = await igRes.json();
                    platformUserId = igData.instagram_business_account?.id || pageId;

                    const igUserRes = await fetch(
                        `https://graph.facebook.com/v18.0/${platformUserId}?fields=username&access_token=${accessToken}`
                    );
                    const igUserData = await igUserRes.json();
                    platformUsername = igUserData.username || "instagram_user";
                }
                break;
            }

            case "youtube": {
                const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: new URLSearchParams({
                        client_id: process.env.GOOGLE_CLIENT_ID!,
                        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                        code,
                        grant_type: "authorization_code",
                        redirect_uri: redirectUri,
                    }),
                });
                const tokenData = await tokenRes.json();
                accessToken = tokenData.access_token;
                refreshToken = tokenData.refresh_token || "";
                if (tokenData.expires_in) {
                    tokenExpiresAt = new Date(
                        Date.now() + tokenData.expires_in * 1000
                    ).toISOString();
                }

                // Get YouTube channel info
                const channelRes = await fetch(
                    `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true`,
                    {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }
                );
                const channelData = await channelRes.json();
                if (channelData.items?.length > 0) {
                    platformUserId = channelData.items[0].id;
                    platformUsername = channelData.items[0].snippet?.title || "YouTube Channel";
                }
                break;
            }
        }

        // Save to database
        await supabase.from("connected_accounts").upsert(
            {
                user_id: user.id,
                platform: platform as "tiktok" | "instagram" | "youtube",
                platform_user_id: platformUserId,
                platform_username: platformUsername,
                access_token: accessToken,
                refresh_token: refreshToken || null,
                token_expires_at: tokenExpiresAt,
                updated_at: new Date().toISOString(),
            },
            {
                onConflict: "user_id,platform,platform_user_id",
            }
        );

        return NextResponse.redirect(
            `${appUrl}/dashboard/accounts?connected=${platform}`
        );
    } catch (error: unknown) {
        console.error(`OAuth callback error for ${platform}:`, error);
        return NextResponse.redirect(
            `${appUrl}/dashboard/accounts?error=oauth_failed&platform=${platform}`
        );
    }
}
