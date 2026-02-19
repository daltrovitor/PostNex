import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-20 px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-border/50">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Home
                </Link>
                <h1 className="text-3xl font-bold mb-6">Termos de Serviço</h1>
                <div className="prose prose-sm text-muted-foreground space-y-4">
                    <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">1. Aceitação dos Termos</h2>
                    <p>Ao acessar e usar o PostNex, você concorda em cumprir e ficar vinculado a estes Termos de Serviço.</p>

                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">2. Descrição do Serviço</h2>
                    <p>O PostNex é uma plataforma que permite aos usuários agendar e publicar conteúdo em múltiplas redes sociais, incluindo TikTok, Instagram e YouTube, a partir de um único painel.</p>

                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">3. Contas de Usuário</h2>
                    <p>Para usar grande parte de nossos serviços, você deve registrar uma conta. Você é responsável por manter a confidencialidade de suas credenciais de login e por todas as atividades que ocorrem sob sua conta.</p>

                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">4. Conduta do Usuário</h2>
                    <p>Você concorda em não usar o serviço para qualquer finalidade ilegal ou proibida por estes Termos. É estritamente proibido publicar conteúdo que viole as diretrizes das plataformas integradas.</p>

                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">5. Limitação de Responsabilidade</h2>
                    <p>O PostNex não se responsabiliza por quaisquer danos diretos, indiretos, incidentais, especiais ou consequentes resultantes do uso ou da incapacidade de usar o serviço.</p>
                </div>
            </div>
        </div>
    );
}
