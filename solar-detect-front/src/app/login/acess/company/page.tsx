"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Button";
import { authService } from "@/services/authService";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function CompanyLoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
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
        body: JSON.stringify({ ...data, userType: 'COMPANY' }),
      });

      if (!res.ok) {
        let errText = `Erro HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          errText += ` - ${JSON.stringify(errJson)}`;
        } catch (_) {
          // não JSON no corpo
        }
        throw new Error(errText);
      }

      const userData = await res.json();
      if (userData.userType !== 'COMPANY') {
        throw new Error("Tipo de usuário inválido para esta página de login.");
      }

      // Salva o token e tipo de usuário
      authService.setAuth(userData);

      // Redireciona para a página solardetect
      window.location.href = '/solardetect';

    } catch (error) {
      console.error("Erro ao fazer login:", error);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Login Empresa
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-gray-700">Senha</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <Button type="submit" size="lg" className="w-full mt-4">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
}
