import { Button } from "./Button";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative text-white h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/earth-backgound.mp4" type="video/mp4" />
        Seu navegador não suporta vídeos HTML5.
      </video>

      {/* Overlay mais suave */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/60 via-green-800/40 to-green-900/70"></div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
          Detecte placas solares com inteligência artificial
        </h1>
        <p className="text-lg md:text-2xl mb-8 animate-fadeInUp delay-200">
          Auxiliando companhias de energia a monitorar a energia solar de forma
          fácil e eficiente.
        </p>
        <div className="flex justify-center gap-4 animate-fadeInUp delay-400">
          <Button size="lg" className="transition-transform hover:scale-105">
            Saiba Mais
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="transition-transform hover:scale-105"
          >
            Teste Agora
          </Button>
        </div>
      </div>
    </section>
  );
}

