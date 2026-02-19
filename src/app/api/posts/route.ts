import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: posts, error } = await supabase
            .from("scheduled_posts")
            .select(`
        *,
        videos (id, title, video_url, thumbnail_url),
        connected_accounts (id, platform, platform_username)
      `)
            .eq("user_id", user.id)
            .order("scheduled_at", { ascending: true });

        if (error) throw error;

        return NextResponse.json({ posts });
    } catch (error: unknown) {
        console.error("Error fetching posts:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check subscription limits
        const { data: subscription } = await supabase
            .from("subscriptions")
            .select("plan")
            .eq("user_id", user.id)
            .eq("status", "active")
            .single();

        if (!subscription) {
            return NextResponse.json(
                { error: "No active subscription" },
                { status: 403 }
            );
        }

        const limits: Record<string, number> = {
            starter: 30,
            pro: 100,
            scale: Infinity,
        };

        // Check monthly usage
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { count } = await supabase
            .from("scheduled_posts")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", startOfMonth.toISOString());

        const limit = limits[subscription.plan] || 0;
        if ((count || 0) >= limit) {
            return NextResponse.json(
                { error: "Monthly post limit reached" },
                { status: 429 }
            );
        }

        const body = await request.json();
        const { video_id, connected_account_id, platform, caption, hashtags, scheduled_at } = body;

        const { data: post, error } = await supabase
            .from("scheduled_posts")
            .insert({
                user_id: user.id,
                video_id,
                connected_account_id,
                platform,
                caption,
                hashtags: hashtags || [],
                scheduled_at,
                status: "pending",
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ post }, { status: 201 });
    } catch (error: unknown) {
        console.error("Error creating post:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
