"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
    CreditCard,
    Check,
    ArrowUpRight,
    AlertCircle,
    Calendar,
    Zap,
} from "lucide-react";

interface Subscription {
    id: string;
    plan: string;
    status: string;
    current_period_start: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    stripe_subscription_id: string;
}

const planDetails: Record<string, { name: string; price: string; features: string[] }> = {
    starter: {
        name: "Starter",
        price: "R$ 97",
        features: ["30 vídeos/mês", "1 conta/plataforma", "Agendamento", "Analytics básico"],
    },
    pro: {
        name: "Pro",
        price: "R$ 197",
        features: ["100 vídeos/mês", "3 contas/plataforma", "Agendamento inteligente", "Analytics avançado", "AI hashtags"],
    },
    scale: {
        name: "Scale",
        price: "R$ 397",
        features: ["Vídeos ilimitados", "Multi usuários", "API access", "Suporte prioritário"],
    },
};

export default function BillingPage() {
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubscription = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data } = await supabase
                .from("subscriptions")
                .select("*")
                .eq("user_id", user.id)
                .single();

            setSubscription(data);
            setLoading(false);
        };
        fetchSubscription();
    }, []);

    const handleManageBilling = async () => {
        try {
            const response = await fetch("/api/billing/portal", {
                method: "POST",
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Error opening billing portal:", error);
        }
    };

    const handleUpgrade = async (newPlan: string) => {
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: newPlan }),
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error("Error upgrading:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    const currentPlan = subscription ? planDetails[subscription.plan] : null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Gerencie seu plano e pagamentos.
                </p>
            </div>

            {/* Current Plan */}
            {subscription && currentPlan && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-border/50 overflow-hidden"
                >
                    <div className="p-6 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <img src="/logo3.png" alt="PostNex Logo" className="w-40 h-auto rounded-xl object-cover" />
                                <div>
                                    <h3 className="font-semibold">
                                        Plano {currentPlan.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {currentPlan.price}/mês
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${subscription.status === "active"
                                        ? "bg-emerald-50 text-emerald-600"
                                        : subscription.status === "past_due"
                                            ? "bg-red-50 text-red-600"
                                            : "bg-gray-100 text-gray-600"
                                        }`}
                                >
                                    {subscription.status === "active"
                                        ? "Ativo"
                                        : subscription.status === "past_due"
                                            ? "Pagamento pendente"
                                            : "Cancelado"}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                                Período atual
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                {new Date(subscription.current_period_start).toLocaleDateString("pt-BR")} → {" "}
                                {new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">
                                Recursos incluídos
                            </p>
                            <div className="space-y-1">
                                {currentPlan.features.map((f) => (
                                    <div key={f} className="flex items-center gap-2 text-sm">
                                        <Check className="w-3.5 h-3.5 text-primary" />
                                        {f}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {subscription.cancel_at_period_end && (
                        <div className="px-6 pb-6">
                            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                <p className="text-sm text-amber-800">
                                    Cancelamento programado. Sua assinatura será encerrada em{" "}
                                    {new Date(subscription.current_period_end).toLocaleDateString("pt-BR")}.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="px-6 pb-6">
                        <button
                            onClick={handleManageBilling}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 border border-border text-sm font-medium hover:bg-gray-100 transition-colors"
                        >
                            <CreditCard className="w-4 h-4" />
                            Gerenciar Pagamentos
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </motion.div>
            )}

            {/* Upgrade Options */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <h3 className="font-semibold mb-4">Trocar de plano</h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(planDetails).map(([key, plan]) => {
                        const isCurrent = subscription?.plan === key;
                        return (
                            <div
                                key={key}
                                className={`p-5 rounded-2xl border transition-all ${isCurrent
                                    ? "border-primary/30 bg-indigo-50/30"
                                    : "border-border/50 bg-white hover:shadow-md"
                                    }`}
                            >
                                <div className="text-sm font-medium">{plan.name}</div>
                                <div className="text-2xl font-extrabold mt-1">{plan.price}</div>
                                <div className="text-xs text-muted-foreground mb-4">/mês</div>

                                {isCurrent ? (
                                    <div className="w-full text-center py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                                        Plano Atual
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleUpgrade(key)}
                                        className="w-full py-2 rounded-lg gradient-bg text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
                                    >
                                        {subscription && Object.keys(planDetails).indexOf(key) > Object.keys(planDetails).indexOf(subscription.plan)
                                            ? "Upgrade"
                                            : "Mudar"}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
