"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Play,
  Zap,
  Clock,
  BarChart3,
  Shield,
  Upload,
  Calendar,
  Globe,
  Check,
  X,
  Star,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  Hash,
  RefreshCw,
  Copy,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

// ─── Navbar ───────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => setScrolled(window.scrollY > 20));
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "glass-strong shadow-sm"
        : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo3.png" alt="PostNex Logo" className="w-8 h-8 rounded-lg" />
          <span className="text-lg font-bold tracking-tight">PostNex</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Recursos
          </a>
          <a href="#comparison" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Comparação
          </a>
          <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Planos
          </a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            FAQ
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Entrar
          </Link>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-bg text-white text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105"
          >
            Começar Agora
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}

// ─── Hero Section ─────────────────────────────────────
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-32 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-40 right-0 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <motion.div style={{ y, opacity }} className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-medium mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Plataforma #1 em automação de conteúdo
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.95] mb-6"
        >
          Poste em todas
          <br />
          as plataformas
          <br />
          <span className="gradient-text">com 1 clique.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Pare de perder tempo publicando manualmente. O PostNex publica
          automaticamente seus vídeos no TikTok, Instagram e YouTube com a
          mesma legenda, hashtags e agendamento.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-3 px-8 py-4 rounded-full gradient-bg text-white text-base font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
          >
            COMEÇAR AGORA
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white border border-border text-foreground text-base font-semibold hover:bg-muted transition-all duration-300"
          >
            <Play className="w-5 h-5 text-primary" />
            Ver Demonstração
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center justify-center gap-8 md:gap-12 mt-16 text-sm text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">2.500+</strong> criadores</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">150k+</strong> vídeos publicados</span>
          </div>
          <div className="w-px h-4 bg-border hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span><strong className="text-foreground">99.9%</strong> uptime</span>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          id="demo"
          className="relative mt-20 max-w-5xl mx-auto"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50">
            {/* Fake browser bar */}
            <div className="bg-gray-50 border-b border-border px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 ml-4">
                <div className="bg-white rounded-lg border border-border px-4 py-1.5 text-xs text-muted-foreground max-w-md mx-auto">
                  app.postnex.com/dashboard
                </div>
              </div>
            </div>
            {/* Dashboard mock */}
            <div className="bg-white p-6">
              <div className="grid grid-cols-12 gap-4">
                {/* Sidebar mock */}
                <div className="col-span-2 space-y-3">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <div className="w-4 h-4 rounded bg-indigo-100" />
                    <div className="h-2 w-12 rounded bg-indigo-200" />
                  </div>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-2">
                      <div className="w-4 h-4 rounded bg-gray-100" />
                      <div className="h-2 w-14 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
                {/* Main content mock */}
                <div className="col-span-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 rounded bg-gray-100" />
                    <div className="h-8 w-28 rounded-lg gradient-bg opacity-80" />
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: "Publicados", value: "127", color: "bg-emerald-50 text-emerald-600" },
                      { label: "Agendados", value: "34", color: "bg-blue-50 text-blue-600" },
                      { label: "Views", value: "1.2M", color: "bg-violet-50 text-violet-600" },
                      { label: "Engajamento", value: "8.4%", color: "bg-amber-50 text-amber-600" },
                    ].map((stat) => (
                      <div key={stat.label} className={`p-4 rounded-xl ${stat.color}`}>
                        <div className="text-xs opacity-70">{stat.label}</div>
                        <div className="text-2xl font-bold mt-1">{stat.value}</div>
                      </div>
                    ))}
                  </div>
                  {/* Chart area mock */}
                  <div className="h-32 rounded-xl bg-gradient-to-r from-indigo-50 to-violet-50 flex items-end p-4 gap-1">
                    {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-indigo-400 to-violet-400 opacity-60"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-indigo-200/20 via-violet-200/20 to-cyan-200/20 rounded-3xl blur-2xl -z-10" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Pain Section ────────────────────────────────────
function PainSection() {
  const pains = [
    {
      icon: Clock,
      title: "Horas perdidas publicando",
      description:
        "Criadores gastam em média 4 horas por semana apenas publicando o mesmo conteúdo em plataformas diferentes.",
    },
    {
      icon: RefreshCw,
      title: "Processo repetitivo e manual",
      description:
        "Upload, legenda, hashtags, thumbnail. Tudo repetido 3x para cada vídeo. Isso é insustentável.",
    },
    {
      icon: BarChart3,
      title: "Zero visibilidade de métricas",
      description:
        "Sem um dashboard unificado, você nunca sabe qual plataforma está performando melhor.",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-danger uppercase tracking-widest">
            O Problema
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
            Publicação manual é
            <span className="text-danger"> atraso.</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Enquanto você publica manualmente, seus concorrentes estão escalando
            com automação.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {pains.map((pain, i) => (
            <motion.div
              key={pain.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group p-8 rounded-2xl bg-white border border-border/50 hover:border-danger/20 hover:shadow-lg hover:shadow-danger/5 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <pain.icon className="w-6 h-6 text-danger" />
              </div>
              <h3 className="text-xl font-bold mb-3">{pain.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {pain.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Solution Section ────────────────────────────────
function SolutionSection() {
  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "1 Upload",
      description: "Suba seu vídeo uma única vez. Nós cuidamos do resto.",
    },
    {
      number: "02",
      icon: Globe,
      title: "3 Plataformas",
      description:
        "TikTok, Instagram e YouTube. Publicação simultânea, sem esforço.",
    },
    {
      number: "03",
      icon: Calendar,
      title: "1 Horário",
      description:
        "Agende para quando quiser. IA sugere o melhor horário.",
    },
    {
      number: "04",
      icon: Shield,
      title: "Total Controle",
      description:
        "Analytics unificado, reaproveitamento e clonagem de posts.",
    },
  ];

  return (
    <section id="features" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-100/30 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            A Solução
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
            Automatize.{" "}
            <span className="gradient-text">Escale.</span> Domine.
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            PostNex é a única plataforma que você precisa para dominar
            todas as redes sociais ao mesmo tempo.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="group relative p-8 rounded-2xl bg-white border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <span className="absolute top-4 right-4 text-6xl font-black text-gray-50 group-hover:text-indigo-50 transition-colors">
                {step.number}
              </span>
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl gradient-bg-subtle flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Differentials Section ───────────────────────────
function DifferentialsSection() {
  const features = [
    {
      icon: Brain,
      title: "AI para Hashtags",
      description: "Inteligência artificial analisa seu conteúdo e gera as melhores hashtags automaticamente.",
    },
    {
      icon: Clock,
      title: "Horário Ideal",
      description: "Algoritmo que sugere o melhor horário para publicar baseado no engajamento do seu público.",
    },
    {
      icon: RefreshCw,
      title: "Reaproveitamento",
      description: "Republique conteúdos de sucesso automaticamente em intervalos estratégicos.",
    },
    {
      icon: Copy,
      title: "Clonagem de Post",
      description: "Clone qualquer post com 1 clique. Mesma legenda, novo vídeo. Produtividade máxima.",
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-accent uppercase tracking-widest">
            Diferenciais
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
            Funcionalidades que{" "}
            <span className="gradient-text">ninguém tem.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group flex gap-5 p-6 rounded-2xl bg-white border border-border/50 hover:border-accent/20 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-violet-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Comparison Section ──────────────────────────────
function ComparisonSection() {
  const rows = [
    { feature: "Upload único para 3 plataformas", manual: false, postnex: true },
    { feature: "Agendamento inteligente com IA", manual: false, postnex: true },
    { feature: "Hashtags geradas por IA", manual: false, postnex: true },
    { feature: "Analytics unificado", manual: false, postnex: true },
    { feature: "Tempo médio por publicação", manual: "15 min", postnex: "30 seg" },
    { feature: "Reaproveitamento automático", manual: false, postnex: true },
    { feature: "Clonagem de posts", manual: false, postnex: true },
    { feature: "Sugestão de horário ideal", manual: false, postnex: true },
  ];

  return (
    <section id="comparison" className="py-32">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Comparação
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
            Manual vs{" "}
            <span className="gradient-text">PostNex</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border border-border/50 overflow-hidden shadow-lg"
        >
          <div className="grid grid-cols-3 bg-gray-50 border-b border-border">
            <div className="p-4 pl-6 text-sm font-medium text-muted-foreground">
              Funcionalidade
            </div>
            <div className="p-4 text-center text-sm font-medium text-muted-foreground">
              Manual
            </div>
            <div className="p-4 text-center text-sm font-bold gradient-text">
              PostNex
            </div>
          </div>
          {rows.map((row, i) => (
            <div
              key={row.feature}
              className={`grid grid-cols-3 ${i !== rows.length - 1 ? "border-b border-border/50" : ""
                } hover:bg-indigo-50/30 transition-colors`}
            >
              <div className="p-4 pl-6 text-sm font-medium">{row.feature}</div>
              <div className="p-4 flex items-center justify-center">
                {typeof row.manual === "boolean" ? (
                  row.manual ? (
                    <Check className="w-5 h-5 text-success" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300" />
                  )
                ) : (
                  <span className="text-sm text-danger font-medium">{row.manual}</span>
                )}
              </div>
              <div className="p-4 flex items-center justify-center">
                {typeof row.postnex === "boolean" ? (
                  row.postnex ? (
                    <Check className="w-5 h-5 text-primary" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300" />
                  )
                ) : (
                  <span className="text-sm text-primary font-bold">{row.postnex}</span>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

// ─── Social Proof Section ────────────────────────────
function SocialProofSection() {
  const testimonials = [
    {
      name: "Lucas Andrade",
      role: "Criador de conteúdo • 500K followers",
      avatar: "LA",
      quote:
        "Antes eu gastava 2 horas por dia só publicando. Agora faço tudo em 5 minutos. O PostNex mudou completamente minha rotina.",
      rating: 5,
    },
    {
      name: "Marina Costa",
      role: "Social Media Manager • Agência Pulse",
      avatar: "MC",
      quote:
        "Gerencio 12 contas de clientes. Sem o PostNex seria impossível manter a consistência em todas as plataformas.",
      rating: 5,
    },
    {
      name: "Rafael Teixeira",
      role: "Empreendedor Digital • E-commerce",
      avatar: "RT",
      quote:
        "O recurso de IA para hashtags é absurdo. Meu engajamento subiu 340% nos primeiros 30 dias. Melhor investimento que fiz.",
      rating: 5,
    },
    {
      name: "Camila Freitas",
      role: "YouTuber • 1.2M subscribers",
      avatar: "CF",
      quote:
        "A sugestão de horário ideal me ajudou a entender quando meu público está online. Os resultados foram imediatos.",
      rating: 5,
    },
    {
      name: "Diego Oliveira",
      role: "CEO • Agência Nexus Digital",
      avatar: "DO",
      quote:
        "Reduzimos 80% do tempo da equipe em publicação de conteúdo. O ROI é absurdo. Recomendo para qualquer agência.",
      rating: 5,
    },
    {
      name: "Beatriz Santos",
      role: "Influenciadora • Fitness & Lifestyle",
      avatar: "BS",
      quote:
        "Finalmente uma ferramenta que funciona de verdade. Simples, rápida e confiável. Não vivo sem.",
      rating: 5,
    },
  ];

  return (
    <section className="py-32 bg-gradient-to-b from-white to-gray-50/50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Depoimentos
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
            Quem usa,{" "}
            <span className="gradient-text">domina.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-border/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white text-xs font-bold">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ─────────────────────────────────
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "97",
      period: "/mês",
      description: "Para criadores que estão começando a escalar.",
      features: [
        "30 vídeos por mês",
        "1 conta por plataforma",
        "Agendamento",
        "Analytics básico",
        "Suporte por email",
      ],
      cta: "Começar com Starter",
      popular: false,
    },
    {
      name: "Pro",
      price: "197",
      period: "/mês",
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
      cta: "Começar com Pro",
      popular: true,
    },
    {
      name: "Scale",
      price: "397",
      period: "/mês",
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
      cta: "Começar com Scale",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Planos
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
            Invista em{" "}
            <span className="gradient-text">resultado.</span>
          </h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto">
            Sem plano grátis. Sem trial. Apenas resultados reais para quem leva
            conteúdo a sério.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`relative p-8 rounded-2xl border transition-all duration-300 ${plan.popular
                ? "border-primary/30 shadow-xl shadow-primary/10 scale-105 bg-white"
                : "border-border/50 bg-white hover:shadow-lg hover:shadow-primary/5"
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
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-8">
                {plan.description}
              </p>

              <Link
                href={`/pricing?plan=${plan.name.toLowerCase()}`}
                className={`block w-full text-center py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${plan.popular
                  ? "gradient-bg text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02]"
                  : "bg-gray-50 text-foreground hover:bg-gray-100 border border-border"
                  }`}
              >
                {plan.cta}
              </Link>

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
    </section>
  );
}

// ─── FAQ Section ─────────────────────────────────────
function FAQSection() {
  const faqs = [
    {
      question: "Como funciona a integração com as plataformas?",
      answer:
        "Utilizamos as APIs oficiais do TikTok, Instagram e YouTube. Basta conectar suas contas via OAuth e o PostNex faz o resto. Processo seguro e aprovado pelas plataformas.",
    },
    {
      question: "Posso cancelar minha assinatura a qualquer momento?",
      answer:
        "Sim. Você pode cancelar a qualquer momento. Sua assinatura ficará ativa até o final do período já pago. Sem taxas de cancelamento.",
    },
    {
      question: "Qual a qualidade dos vídeos publicados?",
      answer:
        "Mantemos a qualidade original do seu vídeo. Não fazemos compressão adicional. O vídeo é enviado diretamente para cada plataforma na qualidade máxima suportada.",
    },
    {
      question: "A IA de hashtags realmente funciona?",
      answer:
        "Nossa IA analisa o conteúdo do seu vídeo, a legenda e as tendências atuais para gerar hashtags relevantes. Usuários reportam em média 3x mais alcance com hashtags geradas pela IA.",
    },
    {
      question: "Posso usar o PostNex para clientes?",
      answer:
        "Sim! Os planos Pro e Scale são perfeitos para agências. Você pode conectar múltiplas contas e gerenciar tudo de um só lugar. O plano Scale oferece multi-usuários para sua equipe.",
    },
    {
      question: "E se minha publicação falhar?",
      answer:
        "Nosso sistema detecta falhas automaticamente e tenta reenviar até 3 vezes. Você recebe uma notificação e pode ver o status detalhado de cada publicação no dashboard.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 bg-gradient-to-b from-gray-50/50 to-white">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            FAQ
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-4 tracking-tight">
            Dúvidas{" "}
            <span className="gradient-text">frequentes.</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border/50 bg-white overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-sm">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-200 ${openIndex === i ? "rotate-180" : ""
                    }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === i ? "auto" : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA Section ───────────────────────────────
function FinalCTASection() {
  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg opacity-[0.03]" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-100/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Pare de publicar
            <br />
            <span className="gradient-text">manualmente.</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Cada minuto que você gasta publicando manualmente é um minuto que
            poderia estar criando conteúdo. Automatize agora.
          </p>
          <Link
            href="/pricing"
            className="group inline-flex items-center gap-3 px-10 py-5 rounded-full gradient-bg text-white text-lg font-bold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300 hover:scale-105"
          >
            COMEÇAR AGORA
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-sm text-muted-foreground mt-6">
            Sem trial. Sem compromisso. Cancele quando quiser.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo3.png" alt="PostNex Logo" className="w-7 h-7 rounded-lg object-cover" />
            <span className="text-sm font-bold">PostNex</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Termos
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacidade
            </Link>
            <a href="#" className="hover:text-foreground transition-colors">
              Suporte
            </a>
          </div>
          <div className="text-sm text-muted-foreground">
            © 2026 PostNex. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Landing Page ───────────────────────────────
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <PainSection />
      <SolutionSection />
      <DifferentialsSection />
      <ComparisonSection />
      <SocialProofSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
      <Footer />
    </main>
  );
}
