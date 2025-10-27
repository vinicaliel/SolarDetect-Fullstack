"use client";

import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { CardFeature } from "@/components/CardFeature";
import { Footer } from "@/components/Footer";
import { Zap, Shield, TrendingUp, BarChart2 } from "lucide-react";

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

      <section
        id="como-funciona"
        className="bg-white py-20 px-6 flex flex-col items-center text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-6">
          Como Trabalhamos
        </h2>
        <p className="max-w-3xl text-gray-700 text-lg mb-10 leading-relaxed">
          Utilizamos <span className="font-semibold">imagens de satélite</span>{" "}
          de alta resolução combinadas com um modelo de{" "}
          <span className="font-semibold">inteligência artificial próprio</span>
          , treinado para identificar e analisar a presença de{" "}
          <span className="font-semibold">placas solares em telhados</span>.
          Nosso sistema realiza a{" "}
          <span className="font-semibold">análise em tempo real</span>, bastando
          informar as{" "}
          <span className="font-semibold">
            coordenadas de latitude e longitude
          </span>{" "}
          para detectar automaticamente a existência de instalações solares.
        </p>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl">
          <div className="p-6 border rounded-xl shadow-sm hover:shadow-lg transition">
            <img
              src="/globe.svg"
              alt="Satélite"
              className="mx-auto w-16 h-16 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2 text-green-700">
              Imagens de Satélite
            </h3>
            <p className="text-gray-600">
              Acesso a fontes atualizadas e precisas para garantir alta
              cobertura e qualidade visual.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm hover:shadow-lg transition">
            <img src="/file.svg" alt="IA" className="mx-auto w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-green-700">
              Modelo de IA Treinado
            </h3>
            <p className="text-gray-600">
              Nosso modelo foi desenvolvido e treinado internamente para
              maximizar a precisão na detecção.
            </p>
          </div>

          <div className="p-6 border rounded-xl shadow-sm hover:shadow-lg transition">
            <img
              src="/window.svg"
              alt="Análise em Tempo Real"
              className="mx-auto w-16 h-16 mb-4"
            />
            <h3 className="text-xl font-semibold mb-2 text-green-700">
              Análise em Tempo Real
            </h3>
            <p className="text-gray-600">
              Basta fornecer as coordenadas de localização — o sistema realiza a
              análise automaticamente.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
