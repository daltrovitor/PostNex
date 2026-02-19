import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const redirect = searchParams.get("redirect") || "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            // Check if user has a subscription
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                // Check/create user profile
                const { data: existingUser } = await supabase
                    .from("users")
                    .select("id")
                    .eq("id", user.id)
                    .single();

                if (!existingUser) {
                    await supabase.from("users").insert({
                        id: user.id,
                        email: user.email!,
                        full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
                        avatar_url: user.user_metadata?.avatar_url || null,
                    });
                }

                // Check subscription
                const { data: subscription } = await supabase
                    .from("subscriptions")
                    .select("id")
                    .eq("user_id", user.id)
                    .eq("status", "active")
                    .single();

                if (!subscription) {
                    return NextResponse.redirect(`${origin}/pricing?reason=no_subscription`);
                }
            }

            return NextResponse.redirect(`${origin}${redirect}`);
        }
    }

    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
