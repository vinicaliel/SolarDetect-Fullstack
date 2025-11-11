"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/Button";
import { authService } from "@/services/authService";
import { IMaskInput } from "react-imask";
import { isValidPhone } from "@/utils/validators";
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

const updateSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, {
      message: "Nome deve conter apenas letras",
    }),
  email: z
    .string()
    .email({ message: "Email inválido" })
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {
      message: "Formato de email inválido",
    }),
  phone: z
    .string()
    .optional()
    .refine((phone) => !phone || isValidPhone(phone), {
      message: "Telefone deve estar no formato (XX)XXXXX-XXXX",
    }),
  address: z
    .string()
    .optional()
    .refine((address) => !address || address.length >= 5, {
      message: "Endereço deve ter pelo menos 5 caracteres",
    }),
});

type UpdateForm = z.infer<typeof updateSchema>;

interface UserProfile {
  id: number;
  email: string;
  name: string;
  userType: string;
  documentNumber: string;
  phone: string | null;
  address: string | null;
  quota: {
    remainingRequests: number;
    totalQuota: number;
    lastResetTime: string;
    minutesUntilReset: number;
  };
}

export default function UpdateUserPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateForm>({
    resolver: zodResolver(updateSchema),
  });

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchProfile();
  }, [router]);

  async function fetchProfile() {
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = authService.getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401) {
          authService.clearAuth();
          router.push("/login");
          return;
        }
        throw new Error(`Erro ao buscar perfil: ${res.status}`);
      }

      const data = await res.json();
      setProfile(data);
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (err: any) {
      console.error("Erro ao buscar perfil:", err);
      setError(err.message || "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(data: UpdateForm) {
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = authService.getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        if (res.status === 401) {
          authService.clearAuth();
          router.push("/login");
          return;
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erro ao atualizar perfil: ${res.status}`
        );
      }

      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setSuccess(true);

      // Redireciona após 2 segundos
      setTimeout(() => {
        router.push("/user");
      }, 2000);
    } catch (err: any) {
      console.error("Erro ao atualizar perfil:", err);
      setError(err.message || "Erro ao atualizar perfil");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <h2 className="text-2xl font-bold mb-4 text-red-700">Erro</h2>
          <p className="text-gray-700 mb-6">{error || "Perfil não encontrado"}</p>
          <Button onClick={() => router.push("/login")}>Voltar ao Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push("/user")}
              className="text-gray-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-green-700 mb-2">
                Editar Perfil
              </h1>
              <p className="text-gray-600">
                Atualize suas informações pessoais
              </p>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="text-green-600" size={24} />
              <p className="text-green-800 font-semibold">
                Perfil atualizado com sucesso! Redirecionando...
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Nome */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nome
              </label>
              <input
                {...register("name")}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Documento (somente leitura) */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                {profile.userType === "STUDENT" ? "CPF" : "CNPJ"} (não editável)
              </label>
              <input
                type="text"
                value={profile.documentNumber}
                disabled
                className="w-full px-3 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
              />
              <p className="text-gray-500 text-xs mt-1">
                O documento não pode ser alterado
              </p>
            </div>

            {/* Telefone */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Telefone (opcional)
              </label>
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
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            {/* Endereço */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Endereço (opcional)
              </label>
              <input
                {...register("address")}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-700"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.address.message}
                </p>
              )}
            </div>

            {/* Botões */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => router.push("/user")}
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
