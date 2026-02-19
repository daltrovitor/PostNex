"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import {
    Settings,
    User,
    Bell,
    Shield,
    Save,
    Check,
    Loader2,
} from "lucide-react";

export default function SettingsPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [notifications, setNotifications] = useState({
        postPublished: true,
        postFailed: true,
        weeklyReport: true,
        productUpdates: false,
    });
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setFullName(user.user_metadata?.full_name || "");
                setEmail(user.email || "");
            }
        };
        fetchUser();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            await supabase.auth.updateUser({
                data: { full_name: fullName },
            });

            await supabase
                .from("users")
                .update({ full_name: fullName, updated_at: new Date().toISOString() })
                .eq("id", user.id);
        }

        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Gerencie sua conta e preferências.
                </p>
            </div>

            {saved && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3"
                >
                    <Check className="w-5 h-5 text-emerald-500" />
                    <p className="text-sm text-emerald-800 font-medium">
                        Configurações salvas com sucesso!
                    </p>
                </motion.div>
            )}

            {/* Profile */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-border/50 p-6"
            >
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Perfil
                </h3>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5">
                            Nome completo
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl border border-border bg-gray-50 text-sm text-muted-foreground cursor-not-allowed"
                        />
                        <p className="text-xs text-muted-foreground mt-1.5">
                            O email não pode ser alterado.
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl border border-border/50 p-6"
            >
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <Bell className="w-5 h-5 text-primary" />
                    Notificações
                </h3>

                <div className="space-y-4">
                    {[
                        { key: "postPublished", label: "Post publicado", desc: "Receber notificação quando um post for publicado com sucesso." },
                        { key: "postFailed", label: "Post falhou", desc: "Receber notificação quando uma publicação falhar." },
                        { key: "weeklyReport", label: "Relatório semanal", desc: "Receber um resumo semanal das suas métricas." },
                        { key: "productUpdates", label: "Atualizações do produto", desc: "Receber novidades e atualizações do PostNex." },
                    ].map((item) => (
                        <label
                            key={item.key}
                            className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                        >
                            <div>
                                <div className="text-sm font-medium">{item.label}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                    {item.desc}
                                </div>
                            </div>
                            <div
                                className={`relative w-10 h-6 rounded-full transition-colors cursor-pointer ${notifications[item.key as keyof typeof notifications]
                                        ? "bg-primary"
                                        : "bg-gray-200"
                                    }`}
                                onClick={() =>
                                    setNotifications((prev) => ({
                                        ...prev,
                                        [item.key]: !prev[item.key as keyof typeof notifications],
                                    }))
                                }
                            >
                                <div
                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${notifications[item.key as keyof typeof notifications]
                                            ? "translate-x-5"
                                            : "translate-x-1"
                                        }`}
                                />
                            </div>
                        </label>
                    ))}
                </div>
            </motion.div>

            {/* Security */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl border border-border/50 p-6"
            >
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Segurança
                </h3>

                <div className="space-y-4">
                    <button className="w-full text-left p-4 rounded-xl border border-border/50 hover:bg-gray-50/50 transition-colors">
                        <div className="text-sm font-medium">Alterar senha</div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                            Atualize sua senha de acesso.
                        </div>
                    </button>
                    <button className="w-full text-left p-4 rounded-xl border border-red-100 hover:bg-red-50/50 transition-colors">
                        <div className="text-sm font-medium text-red-600">
                            Deletar conta
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                            Remover permanentemente sua conta e todos os dados.
                        </div>
                    </button>
                </div>
            </motion.div>

            {/* Save */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl gradient-bg text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50"
                >
                    {saving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4" />
                    )}
                    Salvar Configurações
                </button>
            </div>
        </div>
    );
}
