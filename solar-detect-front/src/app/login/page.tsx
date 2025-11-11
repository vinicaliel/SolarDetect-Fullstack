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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-green-700">Solar Detect</h1>
        <p className="mb-8 text-gray-700">
          Escolha seu tipo de login para acessar a plataforma.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            variant="default"
            size="lg"
            onClick={() => handleChoice("STUDENT")}
            className="w-full"
          >
            Estudante
          </Button>

          <Button
            variant="default"
            size="lg"
            onClick={() => handleChoice("COMPANY")}
            className="w-full"
          >
            Empresa
          </Button>
        </div>

        <p className="mt-6 text-gray-500 text-sm">
          Não possui cadastro?{" "}
          <span
            className="text-green-700 cursor-pointer underline"
            onClick={() => router.push("/register")}
          >
            Cadastre-se aqui
          </span>
        </p>
      </div>
    </div>
  );
}
