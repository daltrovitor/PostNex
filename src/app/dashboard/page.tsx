"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
    Video,
    Clock,
    Eye,
    TrendingUp,
    Calendar,
    CheckCircle2,
    XCircle,
    Loader2,
    PlusCircle,
    ArrowUpRight,
} from "lucide-react";
import Link from "next/link";

interface Stats {
    totalPublished: number;
    totalScheduled: number;
    totalViews: number;
    engagementRate: number;
}

interface RecentPost {
    id: string;
    caption: string;
    platform: string;
    status: string;
    scheduled_at: string;
    published_at: string | null;
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Stats>({
        totalPublished: 0,
        totalScheduled: 0,
        totalViews: 0,
        engagementRate: 0,
    });
    const [recentPosts, setRecentPosts] = useState<RecentPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Check if we just came from a successful checkout
            const searchParams = new URLSearchParams(window.location.search);
            const sessionId = searchParams.get("session_id");

            if (sessionId) {
                try {
                    // Force a quick sync with Stripe since webhooks might be slow (especially locally)
                    const res = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
                    const data = await res.json();

                    if (data.success) {
                        // Clean up URL
                        window.history.replaceState({}, "", "/dashboard");
                    } else {
                        console.error("Verification error:", data.error);
                    }
                } catch (err) {
                    console.error("Verification failed:", err);
                }
            }

            // Fetch stats
            const { count: publishedCount } = await supabase
                .from("scheduled_posts")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id)
                .eq("status", "published");

            const { count: scheduledCount } = await supabase
                .from("scheduled_posts")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id)
                .eq("status", "pending");

            const { data: analyticsData } = await supabase
                .from("analytics")
                .select("views, engagement_rate")
                .eq("user_id", user.id);

            const totalViews = analyticsData?.reduce((sum, a) => sum + (a.views || 0), 0) || 0;
            const avgEngagement = analyticsData?.length
                ? analyticsData.reduce((sum, a) => sum + (a.engagement_rate || 0), 0) / analyticsData.length
                : 0;

            setStats({
                totalPublished: publishedCount || 0,
                totalScheduled: scheduledCount || 0,
                totalViews: totalViews,
                engagementRate: Math.round(avgEngagement * 10) / 10,
            });

            // Fetch recent posts
            const { data: posts } = await supabase
                .from("scheduled_posts")
                .select("id, caption, platform, status, scheduled_at, published_at")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })
                .limit(10);

            setRecentPosts(posts || []);
            setLoading(false);
        };

        fetchData();
    }, []);

    const statCards = [
        {
            label: "Publicados",
            value: stats.totalPublished,
            icon: CheckCircle2,
            color: "bg-emerald-50 text-emerald-600",
            iconColor: "text-emerald-500",
        },
        {
            label: "Agendados",
            value: stats.totalScheduled,
            icon: Clock,
            color: "bg-blue-50 text-blue-600",
            iconColor: "text-blue-500",
        },
        {
            label: "Views Totais",
            value: stats.totalViews >= 1000
                ? `${(stats.totalViews / 1000).toFixed(1)}K`
                : stats.totalViews,
            icon: Eye,
            color: "bg-violet-50 text-violet-600",
            iconColor: "text-violet-500",
        },
        {
            label: "Engajamento",
            value: `${stats.engagementRate}%`,
            icon: TrendingUp,
            color: "bg-amber-50 text-amber-600",
            iconColor: "text-amber-500",
        },
    ];

    const getPlatformBadge = (platform: string) => {
        const colors: Record<string, string> = {
            tiktok: "bg-gray-900 text-white",
            instagram: "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
            youtube: "bg-red-500 text-white",
        };
        return colors[platform] || "bg-gray-100 text-gray-600";
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "published":
                return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
            case "pending":
                return <Clock className="w-4 h-4 text-blue-500" />;
            case "publishing":
                return <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />;
            case "failed":
                return <XCircle className="w-4 h-4 text-red-500" />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Seus resultados em tempo real.
                    </p>
                </div>
                <Link
                    href="/dashboard/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
                >
                    <PlusCircle className="w-4 h-4" />
                    Criar Post
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white rounded-2xl border border-border/50 p-6 hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm text-muted-foreground">{stat.label}</span>
                            <div className={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center`}>
                                <stat.icon className={`w-4 h-4 ${stat.iconColor}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold tracking-tight">{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Recent Posts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-2xl border border-border/50"
            >
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold">Posts Recentes</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            Últimas publicações e agendamentos
                        </p>
                    </div>
                    <Link
                        href="/dashboard/analytics"
                        className="text-sm text-primary font-medium flex items-center gap-1 hover:underline"
                    >
                        Ver tudo
                        <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                </div>

                {recentPosts.length === 0 ? (
                    <div className="p-12 text-center">
                        <Video className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                        <h3 className="font-semibold text-muted-foreground">
                            Nenhum post ainda
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 mb-6">
                            Crie seu primeiro post e comece a dominar todas as plataformas.
                        </p>
                        <Link
                            href="/dashboard/create"
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-bg text-white text-sm font-semibold"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Criar Primeiro Post
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-border/50">
                        {recentPosts.map((post) => (
                            <div
                                key={post.id}
                                className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                            >
                                {getStatusIcon(post.status)}
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">
                                        {post.caption || "Sem legenda"}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                        <Calendar className="w-3 h-3 inline-block mr-1" />
                                        {new Date(post.scheduled_at).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </div>
                                </div>
                                <span
                                    className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${getPlatformBadge(
                                        post.platform
                                    )}`}
                                >
                                    {post.platform}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
