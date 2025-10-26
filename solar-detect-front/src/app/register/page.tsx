"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Button";

const baseSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  documentNumber: z.string().min(11), // CPF/CNPJ
  phone: z.string().optional(),
  address: z.string().optional(),
});

type RegisterForm = z.infer<typeof baseSchema>;

export default function RegisterPage() {
  const [userType, setUserType] = useState<"STUDENT" | "COMPANY">("STUDENT");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(baseSchema),
  });

  const onSubmit = (data: RegisterForm) => {
    const payload = { ...data, userType };
    console.log("Enviar para o backend:", payload);
    // aqui você chamaria o endpoint POST /register
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Cadastro
        </h2>

        <div className="flex justify-center mb-6 gap-4">
          <button
            className={`px-4 py-2 rounded-full font-semibold transition ${
              userType === "STUDENT"
                ? "bg-green-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setUserType("STUDENT")}
          >
            Estudante
          </button>
          <button
            className={`px-4 py-2 rounded-full font-semibold transition ${
              userType === "COMPANY"
                ? "bg-green-700 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setUserType("COMPANY")}
          >
            Empresa
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-gray-700">Nome</label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

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

          <div>
            <label className="block text-gray-700">
              {userType === "STUDENT" ? "CPF" : "CNPJ"}
            </label>
            <input
              {...register("documentNumber")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.documentNumber && (
              <p className="text-red-500 text-sm">{errors.documentNumber.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700">Telefone (opcional)</label>
            <input
              {...register("phone")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <div>
            <label className="block text-gray-700">Endereço (opcional)</label>
            <input
              {...register("address")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
          </div>

          <Button type="submit" size="lg" className="w-full mt-4">
            Cadastrar
          </Button>
        </form>
      </div>
    </div>
  );
}
