import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// Use service role for webhook operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy_key"
);

export async function POST(request: Request) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
        return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err: unknown) {
        console.error("Webhook signature verification failed:", err);
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.supabase_user_id;
                const plan = session.metadata?.plan;
                const subscriptionId = session.subscription as string;

                if (userId && plan && subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId) as Stripe.Subscription;


                    await supabase.from("subscriptions").upsert(
                        {
                            user_id: userId,
                            stripe_customer_id: session.customer as string,
                            stripe_subscription_id: subscriptionId,
                            plan: plan as "starter" | "pro" | "scale",
                            status: "active",
                            current_period_start: new Date(
                                (subscription as any).current_period_start * 1000
                            ).toISOString(),
                            current_period_end: new Date(
                                (subscription as any).current_period_end * 1000
                            ).toISOString(),
                            cancel_at_period_end: false,
                            updated_at: new Date().toISOString(),
                        },
                        {
                            onConflict: "user_id",
                        }
                    );
                }
                break;
            }

            case "customer.subscription.updated": {
                const subscription = event.data.object as Stripe.Subscription;
                const userId = subscription.metadata?.supabase_user_id;

                if (userId) {
                    const statusMap: Record<string, string> = {
                        active: "active",
                        canceled: "canceled",
                        past_due: "past_due",
                        incomplete: "incomplete",
                        trialing: "trialing",
                        unpaid: "past_due",
                        incomplete_expired: "canceled",
                    };

                    await supabase
                        .from("subscriptions")
                        .update({
                            status: (statusMap[subscription.status] || "canceled") as "active" | "canceled" | "past_due" | "incomplete" | "trialing",
                            current_period_start: new Date(
                                (subscription as any).current_period_start * 1000
                            ).toISOString(),
                            current_period_end: new Date(
                                (subscription as any).current_period_end * 1000
                            ).toISOString(),
                            cancel_at_period_end: subscription.cancel_at_period_end,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("stripe_subscription_id", subscription.id);
                }
                break;
            }

            case "customer.subscription.deleted": {
                const subscription = event.data.object as Stripe.Subscription;
                const userId = subscription.metadata?.supabase_user_id;

                if (userId) {
                    await supabase
                        .from("subscriptions")
                        .update({
                            status: "canceled",
                            cancel_at_period_end: true,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("stripe_subscription_id", subscription.id);

                    // Cancel all pending scheduled posts
                    await supabase
                        .from("scheduled_posts")
                        .update({ status: "failed", error_message: "Subscription canceled" })
                        .eq("user_id", userId)
                        .eq("status", "pending");
                }
                break;
            }

            case "invoice.payment_failed": {
                const invoice = event.data.object as Stripe.Invoice;
                const customerId = invoice.customer as string;

                const { data: sub } = await supabase
                    .from("subscriptions")
                    .select("user_id")
                    .eq("stripe_customer_id", customerId)
                    .single();

                if (sub) {
                    await supabase
                        .from("subscriptions")
                        .update({
                            status: "past_due",
                            updated_at: new Date().toISOString(),
                        })
                        .eq("stripe_customer_id", customerId);
                }
                break;
            }
        }
    } catch (err: unknown) {
        console.error("Webhook handler error:", err);
        return NextResponse.json(
            { error: "Webhook handler failed" },
            { status: 500 }
        );
    }

    return NextResponse.json({ received: true });
}
