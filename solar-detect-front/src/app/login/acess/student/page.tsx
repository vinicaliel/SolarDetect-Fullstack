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

export default function StudentLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    console.log("Login Student:", data);
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${API_BASE}/api/auth/login`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, userType: "STUDENT" }),
      });

      if (!res.ok) {
        let errText = `Erro HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          errText += ` - ${JSON.stringify(errJson)}`;
        } catch (_) { }
        throw new Error(errText);
      }

      const userData = await res.json();
      if (userData.userType !== "STUDENT") {
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
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/student.jpg')" }}
    >
      {/* Camada de escurecimento suave */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Card de login */}
      <div className="relative z-10 max-w-md w-full bg-white/90 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700 drop-shadow-sm">
          Login Estudante
        </h2>

        <form onSubmit={handleSubmit(onSubmit, () => toast.error("Por favor, verifique os campos destacados."))} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Senha</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" size="lg" className="w-full mt-4">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
