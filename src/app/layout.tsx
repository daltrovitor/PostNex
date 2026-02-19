import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "PostNex — Poste em todas as plataformas com 1 clique",
  description:
    "Automatize suas publicações no TikTok, Instagram e YouTube. 1 upload, 3 plataformas, total controle. Pare de perder tempo publicando manualmente.",
  keywords: [
    "social media",
    "agendamento",
    "tiktok",
    "instagram",
    "youtube",
    "automação",
    "publicação",
    "marketing digital",
  ],
  openGraph: {
    title: "PostNex — Automatize. Escale. Domine.",
    description:
      "Poste em todas as plataformas com 1 clique. Automatize suas publicações no TikTok, Instagram e YouTube.",
    type: "website",
    locale: "pt_BR",
    url: "https://postnex.com",
  },
  twitter: {
    card: "summary_large_image",
    title: "PostNex — Automatize. Escale. Domine.",
    description:
      "Poste em todas as plataformas com 1 clique. 1 upload, 3 plataformas, total controle.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
