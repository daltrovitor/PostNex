import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS, PlanKey } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { plan } = await request.json();

        if (!plan || !PLANS[plan as PlanKey]) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
        }

        const selectedPlan = PLANS[plan as PlanKey];

        // Check if customer already exists
        let customerId: string;
        const { data: existingSub } = await supabase
            .from("subscriptions")
            .select("stripe_customer_id")
            .eq("user_id", user.id)
            .single();

        if (existingSub?.stripe_customer_id) {
            customerId = existingSub.stripe_customer_id;
        } else {
            // Create Stripe customer
            const customer = await stripe.customers.create({
                email: user.email,
                metadata: {
                    supabase_user_id: user.id,
                },
            });
            customerId = customer.id;
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price: selectedPlan.priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
            metadata: {
                supabase_user_id: user.id,
                plan: plan,
            },
            subscription_data: {
                metadata: {
                    supabase_user_id: user.id,
                    plan: plan,
                },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", {
            message: error.message,
            stack: error.stack,
            type: error.type,
            raw: error.raw
        });
        return NextResponse.json(
            {
                error: "Stripe error: " + (error.message || "Internal server error"),
                details: error.message
            },
            { status: 500 }
        );
    }
}
