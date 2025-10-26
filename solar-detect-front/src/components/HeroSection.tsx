import { Button } from "./Button";

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative bg-green-900 text-white h-screen flex items-center justify-center"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/globe.svg')" }} // substitua por imagem de satélite real se tiver
      ></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/70 via-green-800/50 to-green-900/80"></div>

      {/* Conteúdo */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
          Detecte placas solares com inteligência artificial
        </h1>
        <p className="text-lg md:text-2xl mb-8 animate-fadeInUp delay-200">
          Auxiliando órgãos como Neoenergia a monitorar a energia solar de forma segura e eficiente.
        </p>
        <div className="flex justify-center gap-4 animate-fadeInUp delay-400">
          <Button size="lg" className="transition-transform hover:scale-105">Saiba Mais</Button>
          <Button variant="outline" size="lg" className="transition-transform hover:scale-105">Teste Agora</Button>
        </div>
      </div>
    </section>
  );
}
