import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ platform: string }> }
) {
    const { platform } = await params;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;
    const redirectUri = `${appUrl}/api/auth/${platform}/callback`;

    try {
        switch (platform) {
        case "tiktok": {
            const clientKey = process.env.TIKTOK_CLIENT_KEY!;
            const scope = "user.info.basic,video.publish,video.upload";
            const csrfState = Math.random().toString(36).substring(7);
            const authUrl = `https://www.tiktok.com/v2/auth/authorize/?client_key=${clientKey}&scope=${scope}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&state=${csrfState}`;
            return NextResponse.redirect(authUrl);
        }

        case "instagram": {
            const appId = process.env.INSTAGRAM_APP_ID!;
            const scope = "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement";
            const state = Math.random().toString(36).substring(7);
            const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${state}&response_type=code`;
            return NextResponse.redirect(authUrl);
        }

            case "youtube": {
                const clientId = process.env.GOOGLE_CLIENT_ID!;
                const scope = "https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube.readonly";
                const state = Math.random().toString(36).substring(7);
                const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${state}&response_type=code&access_type=offline&prompt=consent`;
                // Temporary debug log to confirm the exact redirect URL used (remove in production)
                console.log("[oauth] youtube authUrl:", authUrl);
                return NextResponse.redirect(authUrl);
            }
            default: {
                return NextResponse.json(
                    { error: "Platform not supported" },
                    { status: 400 }
                );
            }
        }
    } catch (err) {
        console.error("[api/auth] Error building auth URL:", err);
        return NextResponse.json({ error: "internal_error" }, { status: 500 });
    }
}
