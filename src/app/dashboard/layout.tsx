"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Zap,
    LayoutDashboard,
    PlusCircle,
    Link2,
    BarChart3,
    CreditCard,
    Settings,
    LogOut,
    ChevronLeft,
    Menu,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/create", icon: PlusCircle, label: "Criar Post" },
    { href: "/dashboard/accounts", icon: Link2, label: "Contas" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/dashboard/billing", icon: CreditCard, label: "Billing" },
    { href: "/dashboard/settings", icon: Settings, label: "Configurações" },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [user, setUser] = useState<{ email?: string; full_name?: string } | null>(null);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser({
                    email: user.email,
                    full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split("@")[0],
                });
            }
        });
    }, []);

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
    };

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
        <div
            className={`flex flex-col h-full bg-white border-r border-border/50 transition-all duration-300 ${mobile ? "w-64" : collapsed ? "w-[68px]" : "w-64"
                }`}
        >
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
                <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
                    <img src="/logo3.png" alt="PostNex Logo" className="w-8 h-8 rounded-lg shrink-0 object-cover" />
                    <AnimatePresence>
                        {(!collapsed || mobile) && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                className="text-base font-bold tracking-tight whitespace-nowrap"
                            >
                                PostNex
                            </motion.span>
                        )}
                    </AnimatePresence>
                </Link>
                {!mobile && (
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="p-1.5 rounded-lg hover:bg-gray-50 transition-colors hidden lg:flex"
                    >
                        <ChevronLeft
                            className={`w-4 h-4 text-muted-foreground transition-transform duration-300 ${collapsed ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const active = isActive(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${active
                                ? "bg-indigo-50 text-primary"
                                : "text-muted-foreground hover:bg-gray-50 hover:text-foreground"
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 shrink-0 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                    }`}
                            />
                            <AnimatePresence>
                                {(!collapsed || mobile) && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="text-sm font-medium whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* User */}
            <div className="border-t border-border/50 p-3">
                <div
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl ${collapsed && !mobile ? "justify-center" : ""
                        }`}
                >
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {user?.full_name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <AnimatePresence>
                        {(!collapsed || mobile) && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex-1 min-w-0"
                            >
                                <div className="text-sm font-medium truncate">
                                    {user?.full_name || "Usuário"}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                    {user?.email}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-all mt-1 ${collapsed && !mobile ? "justify-center" : ""
                        }`}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <AnimatePresence>
                        {(!collapsed || mobile) && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="text-sm font-medium"
                            >
                                Sair
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-50/50 overflow-hidden">
            {/* Desktop sidebar */}
            <div className="hidden lg:flex">
                <Sidebar />
            </div>

            {/* Mobile sidebar overlay */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileOpen(false)}
                            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
                        >
                            <Sidebar mobile />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top bar */}
                <header className="h-16 border-b border-border/50 bg-white/80 backdrop-blur-lg flex items-center px-6 shrink-0">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="lg:hidden p-2 -ml-2 mr-2 rounded-lg hover:bg-gray-50"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h2 className="text-sm font-semibold">
                            {navItems.find((item) => isActive(item.href))?.label || "Dashboard"}
                        </h2>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-auto p-6">{children}</main>
            </div>
        </div>
    );
}
