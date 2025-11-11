"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { authService } from "@/services/authService";
import { User, Mail, Phone, MapPin, FileText, Clock, LogOut, Settings, Zap } from "lucide-react";

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

export default function UserProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

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
    } catch (err: any) {
      console.error("Erro ao buscar perfil:", err);
      setError(err.message || "Erro ao carregar perfil");
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    // Limpa o token e redireciona para login
    authService.clearAuth();
    router.push("/login");
  }

  function formatDocument(documentNumber: string, userType: string) {
    if (userType === "STUDENT") {
      // CPF: 000.000.000-00
      return documentNumber.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      // CNPJ: 00.000.000/0000-00
      return documentNumber.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }
  }

  function formatDateTime(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-4 text-red-700">Erro</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <Button onClick={() => router.push("/login")}>Voltar ao Login</Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const quotaPercentage = (profile.quota.remainingRequests / profile.quota.totalQuota) * 100;
  const isQuotaLow = profile.quota.remainingRequests <= profile.quota.totalQuota * 0.3;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-green-700 mb-2">
                Meu Perfil
              </h1>
              <p className="text-gray-600">
                Gerencie suas informações e acompanhe suas requisições
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/user/update")}
                className="flex items-center gap-2"
              >
                <Settings size={18} />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:border-red-700"
              >
                <LogOut size={18} />
                Sair
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Informações do Usuário */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="text-green-700" size={24} />
              Informações Pessoais
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nome</label>
                <p className="text-gray-800 font-semibold">{profile.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Mail size={16} />
                  Email
                </label>
                <p className="text-gray-800">{profile.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <FileText size={16} />
                  {profile.userType === "STUDENT" ? "CPF" : "CNPJ"}
                </label>
                <p className="text-gray-800">
                  {formatDocument(profile.documentNumber, profile.userType)}
                </p>
              </div>
              {profile.phone && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <Phone size={16} />
                    Telefone
                  </label>
                  <p className="text-gray-800">{profile.phone}</p>
                </div>
              )}
              {profile.address && (
                <div>
                  <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <MapPin size={16} />
                    Endereço
                  </label>
                  <p className="text-gray-800">{profile.address}</p>
                </div>
              )}
              <div>
                <label className="text-sm font-medium text-gray-500">Tipo de Usuário</label>
                <p className="text-gray-800">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    profile.userType === "STUDENT"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}>
                    {profile.userType === "STUDENT" ? "Estudante" : "Empresa"}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Quota de Requisições */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Clock className="text-green-700" size={24} />
              Quota de Requisições
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-500">
                    Requisições Restantes
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      isQuotaLow ? "text-red-600" : "text-green-700"
                    }`}
                  >
                    {profile.quota.remainingRequests} / {profile.quota.totalQuota}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className={`h-4 rounded-full transition-all duration-300 ${
                      isQuotaLow ? "bg-red-500" : "bg-green-600"
                    }`}
                    style={{ width: `${quotaPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Último Reset:</strong>{" "}
                  {formatDateTime(profile.quota.lastResetTime)}
                </p>
                {profile.quota.minutesUntilReset > 0 ? (
                  <p className="text-sm text-gray-600">
                    <strong>Próximo Reset em:</strong>{" "}
                    {profile.quota.minutesUntilReset} minuto(s)
                  </p>
                ) : (
                  <p className="text-sm text-green-700 font-semibold">
                    Quota disponível para reset
                  </p>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Info:</strong> Sua quota de requisições é resetada
                  automaticamente a cada 5 minutos. {profile.userType === "STUDENT" ? "Estudantes" : "Empresas"} têm {profile.userType === "STUDENT" ? "3" : "10"} requisições por período.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Botão de Ação Principal */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center">
            <Button
              onClick={() => router.push("/solardetect")}
              size="lg"
              className="w-full max-w-md flex items-center justify-center gap-2"
            >
              <Zap size={20} />
              Fazer Predição Solar
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Use a detecção inteligente para identificar placas solares em imagens de satélite
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
