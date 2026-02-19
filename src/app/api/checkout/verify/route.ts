import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Create a service role client to bypass RLS for subscription updates
const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
    console.log("[Verify] Starting verification...");
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("session_id");

        if (!sessionId) {
            console.error("[Verify] No session ID provided");
            return NextResponse.json({ error: "No session ID" }, { status: 400 });
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.error("[Verify] No authenticated user found");
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log(`[Verify] Retrieving session for user ${user.id}: ${sessionId}`);
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log(`[Verify] Payment status: ${session.payment_status}`);

        if (session.payment_status === "paid") {
            const subscriptionId = session.subscription as string;
            console.log(`[Verify] Retrieving subscription: ${subscriptionId}`);

            if (!subscriptionId) {
                console.error("[Verify] No subscription ID in session");
                return NextResponse.json({ error: "No subscription ID" }, { status: 400 });
            }

            const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
            const plan = (session.metadata?.plan || "starter") as "starter" | "pro" | "scale";

            // Robust date handling
            const periodStart = subscription.current_period_start
                ? new Date(subscription.current_period_start * 1000).toISOString()
                : new Date().toISOString();

            const periodEnd = subscription.current_period_end
                ? new Date(subscription.current_period_end * 1000).toISOString()
                : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // +30 days fallback

            console.log(`[Verify] Upserting subscription to DB for plan: ${plan}`);
            const { error: upsertError } = await supabaseAdmin.from("subscriptions").upsert(
                {
                    user_id: user.id,
                    stripe_customer_id: session.customer as string,
                    stripe_subscription_id: subscriptionId,
                    plan: plan,
                    status: "active",
                    current_period_start: periodStart,
                    current_period_end: periodEnd,
                    cancel_at_period_end: false,
                    updated_at: new Date().toISOString(),
                },
                { onConflict: "user_id" }
            );

            if (upsertError) {
                console.error("[Verify] DB error:", upsertError);
                return NextResponse.json({ error: "Failed to update database", details: upsertError }, { status: 500 });
            }

            console.log("[Verify] Subscription synced successfully!");
            return NextResponse.json({ success: true, status: "active" });
        }

        console.warn("[Verify] Session not paid yet");
        return NextResponse.json({ error: "Session not paid" }, { status: 400 });
    } catch (error: any) {
        console.error("[Verify] Fatal error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
