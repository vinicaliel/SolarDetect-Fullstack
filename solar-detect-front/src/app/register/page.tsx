'use client';

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Button";
import { IMaskInput } from "react-imask";
import { isValidCPF, isValidCNPJ, isValidPhone } from "@/utils/validators";
import { authService } from "@/services/authService";
import { toast } from "sonner";

// Schemas separados para cada tipo de usuário
const studentSchema = z.object({
  name: z.string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, { message: "Nome deve conter apenas letras" }),
  email: z.string()
    .email({ message: "Email inválido" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Formato de email inválido" }),
  password: z.string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
      message: "Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
    }),
  documentNumber: z.string()
    .min(11, { message: "CPF inválido" })
    .refine((cpf) => isValidCPF(cpf), { message: "CPF inválido" }),
  phone: z.string().optional().refine((phone) => !phone || isValidPhone(phone), {
    message: "Telefone deve estar no formato (XX)XXXXX-XXXX"
  }),
  address: z.string().optional().refine((address) => !address || address.length >= 5, {
    message: "Endereço deve ter pelo menos 5 caracteres"
  }),
});

const companySchema = z.object({
  name: z.string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ0-9\s]+$/, { message: "Nome deve conter apenas letras e números" }),
  email: z.string()
    .email({ message: "Email inválido" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: "Formato de email inválido" }),
  password: z.string()
    .min(6, { message: "Senha deve ter pelo menos 6 caracteres" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/, {
      message: "Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial"
    }),
  documentNumber: z.string()
    .min(14, { message: "CNPJ inválido" })
    .refine((cnpj) => isValidCNPJ(cnpj), { message: "CNPJ inválido" }),
  phone: z.string().optional().refine((phone) => !phone || isValidPhone(phone), {
    message: "Telefone deve estar no formato (XX)XXXXX-XXXX"
  }),
  address: z.string().optional().refine((address) => !address || address.length >= 5, {
    message: "Endereço deve ter pelo menos 5 caracteres"
  }),
});

type StudentForm = z.infer<typeof studentSchema>;
type CompanyForm = z.infer<typeof companySchema>;

export default function RegisterPage() {
  const [userType, setUserType] = useState<"STUDENT" | "COMPANY">("STUDENT");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<StudentForm | CompanyForm>({
    resolver: zodResolver(userType === "STUDENT" ? studentSchema : companySchema),
  });

  async function onSubmit(data: StudentForm | CompanyForm) {
    const payload = { ...data, userType };
    console.log("Enviar para o backend:", payload);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${API_BASE}/api/auth/register`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        let errText = `Erro HTTP ${res.status}`;
        try {
          const errJson = await res.json();
          errText += ` - ${JSON.stringify(errJson)}`;
        } catch (_) { }
        throw new Error(errText);
      }

      const json = await res.json().catch(() => null);
      console.log("Resposta do backend:", json ?? `Status ${res.status}`);

      if (json && json.token) {
        authService.setAuth(json);
        window.location.href = '/user';
      } else {
        window.location.href = '/login';
      }
    } catch (error: any) {
      console.error("Erro ao registrar:", error);
      toast.error(error.message || "Ocorreu um erro ao tentar se registrar.");
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/register.webp')" }}
    >
      {/* Camada de escurecimento e blur */}
      <div className="absolute inset-0 bg-black/25 backdrop-blur-sm"></div>

      {/* Card principal */}
      <div className="relative z-10 max-w-md w-full bg-white/90 rounded-2xl shadow-2xl p-8 backdrop-blur-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Cadastro
        </h2>

        {/* Botões de alternância */}
        <div className="flex justify-center mb-6 gap-4">
          <button
            type="button"
            className={`px-4 py-2 rounded-full font-semibold transition ${userType === "STUDENT"
                ? "bg-green-700 text-white"
                : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => setUserType("STUDENT")}
          >
            Estudante
          </button>
          <button
            type="button"
            className={`px-4 py-2 rounded-full font-semibold transition ${userType === "COMPANY"
                ? "bg-green-700 text-white"
                : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => setUserType("COMPANY")}
          >
            Empresa
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit(onSubmit, () => toast.error("Por favor, verifique os campos destacados."))} className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-gray-700 font-medium">Nome</label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium">Email</label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          {/* Senha */}
          <div>
            <label className="block text-gray-700 font-medium">Senha</label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>

          {/* CPF / CNPJ */}
          <div>
            <label className="block text-gray-700 font-medium">
              {userType === "STUDENT" ? "CPF" : "CNPJ"}
            </label>
            <Controller
              name="documentNumber"
              control={control}
              render={({ field: { onChange, value } }) => (
                <IMaskInput
                  mask={userType === "STUDENT" ? "000.000.000-00" : "00.000.000/0000-00"}
                  value={value || ""}
                  onAccept={(value) => onChange(value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder={userType === "STUDENT" ? "000.000.000-00" : "00.000.000/0000-00"}
                />
              )}
            />
            {errors.documentNumber && (
              <p className="text-red-500 text-sm">{errors.documentNumber.message}</p>
            )}
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-gray-700 font-medium">Telefone (opcional)</label>
            <Controller
              name="phone"
              control={control}
              render={({ field: { onChange, value } }) => (
                <IMaskInput
                  mask="(00)00000-0000"
                  value={value || ""}
                  onAccept={(value) => onChange(value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
                  placeholder="(00)00000-0000"
                />
              )}
            />
          </div>

          {/* Endereço */}
          <div>
            <label className="block text-gray-700 font-medium">Endereço (opcional)</label>
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
