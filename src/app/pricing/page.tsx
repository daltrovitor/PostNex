"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Zap,
    Check,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
} from "lucide-react";

function PricingContent() {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();
    const searchParams = useSearchParams();
    const reason = searchParams.get("reason");
    const canceled = searchParams.get("canceled");

    const plans = [
        {
            key: "starter",
            name: "Starter",
            price: "97",
            description: "Para criadores que estão começando a escalar.",
            features: [
                "30 vídeos por mês",
                "1 conta por plataforma",
                "Agendamento",
                "Analytics básico",
                "Suporte por email",
            ],
            popular: false,
        },
        {
            key: "pro",
            name: "Pro",
            price: "197",
            description: "Para criadores sérios e agências pequenas.",
            features: [
                "100 vídeos por mês",
                "3 contas por plataforma",
                "Agendamento inteligente",
                "Analytics avançado",
                "AI hashtags",
                "Sugestão de horário ideal",
                "Suporte prioritário",
            ],
            popular: true,
        },
        {
            key: "scale",
            name: "Scale",
            price: "397",
            description: "Para agências e operações de escala.",
            features: [
                "Vídeos ilimitados",
                "Contas ilimitadas",
                "Multi usuários",
                "API access",
                "Reaproveitamento automático",
                "Clonagem de posts",
                "Prioridade total no suporte",
                "Account manager dedicado",
            ],
            popular: false,
        },
    ];

    const handleCheckout = async (planKey: string) => {
        setLoading(planKey);
        try {
            const response = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planKey }),
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else if (response.status === 401) {
                router.push(`/signup?redirect=/pricing&plan=${planKey}`);
            } else {
                console.error("Checkout error:", data.error);
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50/30 via-white to-violet-50/30">
            {/* Nav */}
            <nav className="border-b border-border/50 bg-white/80 backdrop-blur-lg">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/logo3.png" alt="PostNex Logo" className="w-8 h-8 rounded-lg" />
                        <span className="text-lg font-bold tracking-tight">PostNex</span>
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </Link>
                </div>
            </nav>

            <div className="max-w-6xl mx-auto px-6 py-20">
                {/* Alerts */}
                {reason === "no_subscription" && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                        <p className="text-sm text-amber-800">
                            Você precisa de uma assinatura ativa para acessar o dashboard.
                            Escolha um plano abaixo.
                        </p>
                    </motion.div>
                )}

                {canceled && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 rounded-xl bg-gray-50 border border-border flex items-center gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-muted-foreground shrink-0" />
                        <p className="text-sm text-muted-foreground">
                            Checkout cancelado. Escolha um plano quando estiver pronto.
                        </p>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Escolha seu{" "}
                        <span className="gradient-text">plano</span>
                    </h1>
                    <p className="text-lg text-muted-foreground mt-4 max-w-xl mx-auto">
                        Sem trial. Sem plano grátis. Apenas resultados reais.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 items-start">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.key}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.12 }}
                            className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.popular
                                    ? "border-primary/30 shadow-xl shadow-primary/10 scale-105 bg-white"
                                    : "border-border/50 bg-white hover:shadow-lg"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-bg text-white text-xs font-bold">
                                    MAIS POPULAR
                                </div>
                            )}

                            <div className="text-sm font-medium text-muted-foreground mb-2">
                                {plan.name}
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-sm text-muted-foreground">R$</span>
                                <span className="text-5xl font-extrabold tracking-tight">
                                    {plan.price}
                                </span>
                                <span className="text-muted-foreground">/mês</span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-8">
                                {plan.description}
                            </p>

                            <button
                                onClick={() => handleCheckout(plan.key)}
                                disabled={loading !== null}
                                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all duration-300 disabled:opacity-50 ${plan.popular
                                        ? "gradient-bg text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                                        : "bg-gray-50 text-foreground hover:bg-gray-100 border border-border"
                                    }`}
                            >
                                {loading === plan.key ? (
                                    <div className="w-5 h-5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Começar com {plan.name}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>

                            <div className="mt-8 space-y-3">
                                {plan.features.map((feature) => (
                                    <div key={feature} className="flex items-center gap-3">
                                        <Check className="w-4 h-4 text-primary shrink-0" />
                                        <span className="text-sm text-muted-foreground">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function PricingPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
            }
        >
            <PricingContent />
        </Suspense>
    );
}
