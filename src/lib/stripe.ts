import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-01-28.clover",
    typescript: true,
});

export const PLANS = {
    starter: {
        name: "Starter",
        price: 9700, // R$97 in centavos
        priceId: process.env.STRIPE_STARTER_PRICE_ID!,
        features: [
            "30 vídeos por mês",
            "1 conta por plataforma",
            "Agendamento",
            "Analytics básico",
        ],
        limits: {
            videosPerMonth: 30,
            accountsPerPlatform: 1,
            smartScheduling: false,
            advancedAnalytics: false,
            apiAccess: false,
            multiUser: false,
        },
    },
    pro: {
        name: "Pro",
        price: 19700, // R$197 in centavos
        priceId: process.env.STRIPE_PRO_PRICE_ID!,
        features: [
            "100 vídeos por mês",
            "3 contas por plataforma",
            "Agendamento inteligente",
            "Analytics avançado",
        ],
        limits: {
            videosPerMonth: 100,
            accountsPerPlatform: 3,
            smartScheduling: true,
            advancedAnalytics: true,
            apiAccess: false,
            multiUser: false,
        },
    },
    scale: {
        name: "Scale",
        price: 39700, // R$397 in centavos
        priceId: process.env.STRIPE_SCALE_PRICE_ID!,
        features: [
            "Vídeos ilimitados",
            "Multi usuários",
            "API access",
            "Prioridade no suporte",
        ],
        limits: {
            videosPerMonth: Infinity,
            accountsPerPlatform: Infinity,
            smartScheduling: true,
            advancedAnalytics: true,
            apiAccess: true,
            multiUser: true,
        },
    },
} as const;

export type PlanKey = keyof typeof PLANS;
