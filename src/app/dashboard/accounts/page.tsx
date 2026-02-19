"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
    Link2,
    Plus,
    Trash2,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

interface ConnectedAccount {
    id: string;
    platform: string;
    platform_username: string;
    avatar_url: string | null;
    created_at: string;
}

const platformConfig = {
    tiktok: {
        label: "TikTok",
        color: "bg-gray-900",
        textColor: "text-gray-900",
        bgLight: "bg-gray-50",
        icon: "🎵",
    },
    instagram: {
        label: "Instagram",
        color: "bg-gradient-to-r from-purple-500 to-pink-500",
        textColor: "text-purple-600",
        bgLight: "bg-purple-50",
        icon: "📸",
    },
    youtube: {
        label: "YouTube",
        color: "bg-red-500",
        textColor: "text-red-600",
        bgLight: "bg-red-50",
        icon: "▶️",
    },
};

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from("connected_accounts")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

        setAccounts(data || []);
        setLoading(false);
    };

    const handleConnect = async (platform: string) => {
        // OAuth flow - redirect to platform-specific OAuth endpoint
        window.location.href = `/api/auth/${platform}`;
    };

    const handleDisconnect = async (accountId: string) => {
        if (!confirm("Tem certeza que deseja desconectar esta conta?")) return;

        const supabase = createClient();
        await supabase.from("connected_accounts").delete().eq("id", accountId);
        setAccounts((prev) => prev.filter((a) => a.id !== accountId));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold tracking-tight">Contas Conectadas</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Gerencie suas contas do TikTok, Instagram e YouTube.
                </p>
            </div>

            {/* Platform Cards */}
            <div className="space-y-6">
                {(["tiktok", "instagram", "youtube"] as const).map((platform, i) => {
                    const config = platformConfig[platform];
                    const platformAccounts = accounts.filter(
                        (a) => a.platform === platform
                    );

                    return (
                        <motion.div
                            key={platform}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white rounded-2xl border border-border/50 overflow-hidden"
                        >
                            {/* Platform header */}
                            <div className="px-6 py-5 border-b border-border/50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-10 h-10 rounded-xl ${config.bgLight} flex items-center justify-center text-lg`}
                                    >
                                        {config.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{config.label}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {platformAccounts.length} conta(s) conectada(s)
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleConnect(platform)}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-50 border border-border text-sm font-medium hover:bg-gray-100 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Conectar
                                </button>
                            </div>

                            {/* Connected accounts */}
                            {platformAccounts.length > 0 ? (
                                <div className="divide-y divide-border/50">
                                    {platformAccounts.map((account) => (
                                        <div
                                            key={account.id}
                                            className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50/50 transition-colors"
                                        >
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">
                                                {account.platform_username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium flex items-center gap-2">
                                                    @{account.platform_username}
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Conectado em{" "}
                                                    {new Date(account.created_at).toLocaleDateString("pt-BR")}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDisconnect(account.id)}
                                                className="p-2 rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-8 text-center">
                                    <Link2 className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                        Nenhuma conta {config.label} conectada.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Info */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8 p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3"
            >
                <AlertCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <div className="text-sm text-indigo-800">
                    <p className="font-medium mb-1">Segurança</p>
                    <p className="text-indigo-600">
                        Utilizamos OAuth oficial de cada plataforma. Suas credenciais nunca
                        são armazenadas diretamente. Você pode revogar o acesso a qualquer
                        momento.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
