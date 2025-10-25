import { Button } from "@/components/Button";

export function HeroSection() {
  return (
    <section className="relative h-[85vh] bg-gradient-to-r from-green-700 via-blue-700 to-green-600 flex items-center justify-center text-center text-white px-6">
      <div className="max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Energia que conecta pessoas e transforma o futuro
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-100">
          Sustentabilidade, inovação e compromisso com o Brasil.
        </p>
        <Button variant="default" size="lg">
          Saiba Mais
        </Button>
      </div>
    </section>
  );
}
