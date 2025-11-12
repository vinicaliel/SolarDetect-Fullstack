"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export default function LoginChoicePage() {
  const router = useRouter();

  const handleChoice = (userType: "STUDENT" | "COMPANY") => {
    if (userType === "STUDENT") {
      router.push("/login/acess/student");
    } else {
      router.push("/login/acess/company");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fundo dividido com gradiente suave */}
      <div className="absolute inset-0 flex">
        <div
          className="w-1/2 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: "url('/books-bg.jpg')",
            filter: "blur(3px) brightness(0.9)",
          }}
        />
        <div
          className="w-1/2 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: "url('/briefcase-bg.jpg')",
            filter: "blur(3px) brightness(0.9)",
          }}
        />
      </div>

      {/* Gradiente de transição suave entre as imagens */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-900/50 via-green-800/30 to-green-900/50 pointer-events-none" />

      {/* Card central */}
      <div className="relative z-10 max-w-md w-full bg-white/75 backdrop-blur-md rounded-3xl shadow-2xl border border-green-200/60 p-10 text-center transition-transform duration-300 hover:scale-[1.01]">
        <h1 className="text-4xl font-bold mb-6 text-green-800 drop-shadow-sm">
          Solar Detect
        </h1>
        <p className="mb-8 text-gray-700 leading-relaxed">
          Escolha seu tipo de login para acessar a plataforma.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            onClick={() => handleChoice("STUDENT")}
            className="w-full bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-md"
          >
            Estudante
          </Button>
          <Button
            size="lg"
            onClick={() => handleChoice("COMPANY")}
            className="w-full bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 shadow-md"
          >
            Empresa
          </Button>
        </div>

        <p className="mt-6 text-gray-600 text-sm">
          Não possui cadastro?{" "}
          <span
            className="text-green-700 cursor-pointer underline hover:text-green-800"
            onClick={() => router.push("/register")}
          >
            Cadastre-se aqui
          </span>
        </p>
      </div>

      {/* Sutil vinheta para foco central */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/30 pointer-events-none" />
    </div>
  );
}
