"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CardFeature } from "@/components/CardFeature";
import { Footer } from "@/components/Footer";
import { Zap, Shield, TrendingUp, BarChart2 } from "lucide-react";
import { Button } from "@/components/Button";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      <Navbar />

      {/* Hero da landing page */}
      <HeroSection />

      {/* Cards de funcionalidades */}
      <section
        id="cards"
        className="py-16 px-6 grid sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto"
      >
        <CardFeature
          icon={<Zap className="text-yellow-500" size={36} />}
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
          title="Detecção Inteligente"
          description="IA que identifica irregularidades no uso de energia solar."
        />
        <CardFeature
          icon={<BarChart2 className="text-purple-600" size={36} />}
          title="Relatórios Detalhados"
          description="Visualize dados consolidados e históricos para tomadas de decisão estratégicas."
        />
      </section>

      <Footer />
    </main>
  );
}
