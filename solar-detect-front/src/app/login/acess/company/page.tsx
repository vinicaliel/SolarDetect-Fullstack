"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Button";
import { authService } from "@/services/authService";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function CompanyLoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    console.log("Login Company:", data);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${API_BASE}/api/auth/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, userType: "COMPANY" }),
      });

      if (!res.ok) {
        let errText = `Erro HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          errText += ` - ${JSON.stringify(errJson)}`;
        } catch {
          /* corpo não JSON */
        }
        throw new Error(errText);
      }

      const userData = await res.json();
      if (userData.userType !== "COMPANY") {
        throw new Error("Tipo de usuário inválido para esta página de login.");
      }

      authService.setAuth(userData);
      window.location.href = "/user";
    } catch (error: any) {
      console.error("Erro ao fazer login:", error);
      toast.error("Ocorreu um erro ao tentar fazer login.");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Fundo com imagem da empresa */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
        style={{
          backgroundImage: "url('/company.jpg')",
          filter: "blur(4px) brightness(0.85)",
        }}
      ></div>

      {/* Overlay com gradiente para suavizar */}
      <div className="absolute inset-0 bg-gradient-to-b from-green-900/60 via-green-800/40 to-green-900/70"></div>

      {/* Card de login */}
      <div className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-green-200/60">
        <h2 className="text-3xl font-bold mb-6 text-center text-green-800 drop-shadow-sm">
          Login Empresa
        </h2>

        <form onSubmit={handleSubmit(onSubmit, () => toast.error("Por favor, verifique os campos destacados."))} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 bg-white/90"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Senha
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700 bg-white/90"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-4 bg-green-600 hover:bg-green-700 transition-all duration-300 shadow-md"
          >
            Entrar
          </Button>
        </form>
      </div>

      {/* Vinheta sutil para foco no centro */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/40 pointer-events-none" />
    </div>
  );
}
