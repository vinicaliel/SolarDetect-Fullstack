//landing page
import { Button } from "@/components/Button";
import { HeroSection } from "@/components/HeroSection";
import { CardFeature } from "@/components/CardFeature";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Zap, Shield, TrendingUp } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white text-gray-800">
      <Navbar />
      <HeroSection />

      <section className="py-16 px-6 grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <CardFeature
          icon={<Zap className="text-blue-600" size={36} />}
          title="Monitoramento em Tempo Real"
          description="Acompanhe geração e consumo de energia solar em tempo real, com alertas automáticos."
        />
        <CardFeature
          icon={<Shield className="text-green-600" size={36} />}
          title="Segurança e Estabilidade"
          description="Dados criptografados e infraestrutura robusta para máxima confiabilidade."
        />
        <CardFeature
          icon={<TrendingUp className="text-blue-500" size={36} />}
          title="Análises Inteligentes"
          description="Relatórios automáticos e insights sobre eficiência e economia energética."
        />
      </section>

      <Footer />
    </main>
  );
}

