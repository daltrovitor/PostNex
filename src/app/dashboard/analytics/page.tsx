"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
    BarChart3,
    Eye,
    Heart,
    MessageCircle,
    Share2,
    TrendingUp,
    Filter,
    Calendar,
} from "lucide-react";

interface AnalyticsEntry {
    id: string;
    platform: string;
    views: number;
    likes: number;
    comments: number;
    shares: number;
    engagement_rate: number;
    fetched_at: string;
    scheduled_post_id: string;
}

export default function AnalyticsPage() {
    const [analytics, setAnalytics] = useState<AnalyticsEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [platformFilter, setPlatformFilter] = useState<string>("all");

    useEffect(() => {
        const fetchAnalytics = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("analytics")
                .select("*")
                .eq("user_id", user.id)
                .order("fetched_at", { ascending: false });

            setAnalytics(data || []);
            setLoading(false);
        };
        fetchAnalytics();
    }, []);

    const filteredAnalytics =
        platformFilter === "all"
            ? analytics
            : analytics.filter((a) => a.platform === platformFilter);

    const totalViews = filteredAnalytics.reduce((s, a) => s + a.views, 0);
    const totalLikes = filteredAnalytics.reduce((s, a) => s + a.likes, 0);
    const totalComments = filteredAnalytics.reduce((s, a) => s + a.comments, 0);
    const totalShares = filteredAnalytics.reduce((s, a) => s + a.shares, 0);
    const avgEngagement = filteredAnalytics.length
        ? filteredAnalytics.reduce((s, a) => s + a.engagement_rate, 0) / filteredAnalytics.length
        : 0;

    const formatNumber = (num: number) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toString();
    };

    const summaryCards = [
        { label: "Views", value: formatNumber(totalViews), icon: Eye, color: "bg-blue-50 text-blue-600" },
        { label: "Likes", value: formatNumber(totalLikes), icon: Heart, color: "bg-pink-50 text-pink-600" },
        { label: "Comentários", value: formatNumber(totalComments), icon: MessageCircle, color: "bg-violet-50 text-violet-600" },
        { label: "Compartilhamentos", value: formatNumber(totalShares), icon: Share2, color: "bg-emerald-50 text-emerald-600" },
        { label: "Engajamento Médio", value: `${avgEngagement.toFixed(1)}%`, icon: TrendingUp, color: "bg-amber-50 text-amber-600" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Performance dos seus conteúdos em todas as plataformas.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    {["all", "tiktok", "instagram", "youtube"].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPlatformFilter(p)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${platformFilter === p
                                    ? "gradient-bg text-white shadow-md"
                                    : "bg-gray-50 text-muted-foreground border border-border hover:bg-gray-100"
                                }`}
                        >
                            {p === "all" ? "Todas" : p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                {summaryCards.map((card, i) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white rounded-2xl border border-border/50 p-5"
                    >
                        <div className={`w-8 h-8 rounded-lg ${card.color} flex items-center justify-center mb-3`}>
                            <card.icon className="w-4 h-4" />
                        </div>
                        <div className="text-2xl font-extrabold tracking-tight">{card.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Chart Placeholder */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-border/50 p-6"
            >
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Performance ao Longo do Tempo
                </h3>
                <div className="h-64 flex items-end gap-1 px-4">
                    {Array.from({ length: 30 }).map((_, i) => {
                        const height = 20 + Math.random() * 80;
                        return (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${height}%` }}
                                transition={{ delay: i * 0.02, duration: 0.4 }}
                                className="flex-1 rounded-t bg-gradient-to-t from-indigo-400 to-violet-400 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                                title={`Dia ${i + 1}`}
                            />
                        );
                    })}
                </div>
                <div className="flex justify-between mt-3 text-xs text-muted-foreground px-4">
                    <span>30 dias atrás</span>
                    <span>Hoje</span>
                </div>
            </motion.div>

            {/* Detailed Table */}
            {filteredAnalytics.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl border border-border/50 overflow-hidden"
                >
                    <div className="px-6 py-4 border-b border-border/50">
                        <h3 className="font-semibold">Detalhamento por Post</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border/50 bg-gray-50/50">
                                    <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3">
                                        Plataforma
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">
                                        Views
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">
                                        Likes
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">
                                        Comentários
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">
                                        Engajamento
                                    </th>
                                    <th className="text-right text-xs font-medium text-muted-foreground px-6 py-3">
                                        Data
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredAnalytics.map((entry) => (
                                    <tr key={entry.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-3">
                                            <span className="text-xs font-bold uppercase px-2 py-1 rounded bg-gray-100">
                                                {entry.platform}
                                            </span>
                                        </td>
                                        <td className="text-right text-sm px-6 py-3">
                                            {formatNumber(entry.views)}
                                        </td>
                                        <td className="text-right text-sm px-6 py-3">
                                            {formatNumber(entry.likes)}
                                        </td>
                                        <td className="text-right text-sm px-6 py-3">
                                            {formatNumber(entry.comments)}
                                        </td>
                                        <td className="text-right text-sm font-medium text-primary px-6 py-3">
                                            {entry.engagement_rate.toFixed(1)}%
                                        </td>
                                        <td className="text-right text-xs text-muted-foreground px-6 py-3">
                                            {new Date(entry.fetched_at).toLocaleDateString("pt-BR")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {filteredAnalytics.length === 0 && (
                <div className="text-center py-20">
                    <BarChart3 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="font-semibold text-muted-foreground">
                        Nenhum dado de analytics
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Publique conteúdo para começar a ver suas métricas aqui.
                    </p>
                </div>
            )}
        </div>
    );
}
