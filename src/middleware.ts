import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    // Public routes that don't require authentication
    const publicRoutes = ["/", "/pricing", "/login", "/signup", "/auth/callback"];
    const isPublicRoute = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith("/api/webhooks")
    );

    // If user is not authenticated and trying to access protected route
    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }

    // If user is authenticated, check subscription for dashboard routes
    if (user && pathname.startsWith("/dashboard")) {
        const sessionId = request.nextUrl.searchParams.get("session_id");

        // If there's a session_id, we allow entry so the dashboard can show a loading/sync state
        // and wait for the webhook, or we can just skip the check temporarily.
        if (sessionId) return supabaseResponse;

        const { data: subscription } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active")
            .single();

        // No active subscription → redirect to billing/pricing
        if (!subscription) {
            const url = request.nextUrl.clone();
            url.pathname = "/pricing";
            url.searchParams.set("reason", "no_subscription");
            return NextResponse.redirect(url);
        }
    }

    // If user is authenticated and on login/signup, redirect to dashboard
    if (user && (pathname === "/login" || pathname === "/signup")) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
