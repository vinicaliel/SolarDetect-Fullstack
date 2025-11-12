"use client";

import { useRouter } from "next/navigation";
import { Button } from "./Button";

export function HeroSection() {
  const router = useRouter();

  const handleTesteAgora = () => {
    router.push("/login");
  };

  const handleSaibaMais = () => {
    window.open("https://github.com/vinicaliel/SolarDetect-Fullstack", "_blank");
  };

  return (
    <section
      id="home"
      className="relative text-white h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Vídeo de fundo */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/earth-backgound.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/60 via-green-800/40 to-green-900/70"></div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
          Detecte placas solares com inteligência artificial
        </h1>
        <p className="text-lg md:text-2xl mb-8 animate-fadeInUp delay-200">
          Auxiliando órgãos como Neoenergia a monitorar a energia solar de forma
          segura e eficiente.
        </p>
        <div className="flex justify-center gap-4 animate-fadeInUp delay-400">
          <Button
            size="lg"
            onClick={handleSaibaMais}
            className="transition-transform hover:scale-105"
          >
            Saiba Mais
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleTesteAgora}
            className="transition-transform hover:scale-105"
          >
            Teste Agora
          </Button>
        </div>
      </div>
    </section>
  );
}
