import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 py-20 px-6">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-border/50">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para Home
                </Link>
                <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
                <div className="prose prose-sm text-muted-foreground space-y-4">
                    <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">1. Informações que Coletamos</h2>
                    <p>Coletamos informações que você nos fornece diretamente, como nome, endereço de email e detalhes de pagamento, bem como dados de uso e tokens de acesso de redes sociais que você conecta ao PostNex.</p>

                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">2. Como Usamos as Informações</h2>
                    <p>Usamos suas informações para operar, manter e melhorar nossos serviços, processar transações, gerenciar suas contas conectadas de redes sociais para fins de publicação automatizada, e nos comunicar com você.</p>

                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">3. Compartilhamento de Informações</h2>
                    <p>Não vendemos suas informações pessoais a terceiros. Podemos compartilhar informações com provedores de serviços de terceiros que nos ajudam a operar nossa plataforma (como provedores de hospedagem e processadores de pagamento).</p>

                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">4. Integração com Redes Sociais</h2>
                    <p>A utilização das funcionalidades de terceiros pode estar sujeita à coleta de informações segundo as políticas desses terceiros (como as políticas do YouTube, Instagram e TikTok).</p>

                    <h2 className="text-xl font-semibold text-foreground mt-6 mb-3">5. Segurança dos Dados</h2>
                    <p>Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações pessoais contra perda acidental e acesso não autorizado.</p>
                </div>
            </div>
        </div>
    );
}
