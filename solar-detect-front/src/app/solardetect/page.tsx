"use client";
import { useState, FormEvent, useRef, useEffect } from "react";
import { authService } from "@/services/authService";

export default function SolarDetect() {
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [detectionMsg, setDetectionMsg] = useState<string | null>(null);
  const prevBlobRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (prevBlobRef.current) {
        try { URL.revokeObjectURL(prevBlobRef.current); } catch(_) {}
      }
    };
  }, []);

  function parseAndFormat(value: string | number, type: "lat" | "lon"): string | null {
    if (!value) return null;
    const normalized = String(value).replace(",", ".").trim();
    const n = parseFloat(normalized);
    if (Number.isNaN(n)) return null;

    if (type === "lat" && (n < -90 || n > 90)) return null;
    if (type === "lon" && (n < -180 || n > 180)) return null;

    return n.toFixed(6);
  }

  async function refreshToken() {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    if (!email || !password || !userType) {
      throw new Error('Dados de autenticação não encontrados');
    }

    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, userType }),
    });

    if (!response.ok) throw new Error('Falha ao renovar o token');

    const data = await response.json();
    authService.setAuth(data);
    return data.token;
  }

  async function handleDetect(e: FormEvent) {
    e.preventDefault();
    setError("");
    setImageUrl(null);
    setLoading(true);

    const latF = parseAndFormat(lat, "lat");
    const lonF = parseAndFormat(lon, "lon");

    if (!latF || !lonF) {
      setError("Insira latitude (-90 a 90) e longitude (-180 a 180) válidas.");
      setLoading(false);
      return;
    }

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const url = `${API_BASE}/api/predict?lat=${latF}&lon=${lonF}`;

    try {
      let token = authService.getToken();

      if (token && authService.isTokenNearExpiration(token)) {
        try {
          token = await refreshToken();
        } catch (refreshError) {
          console.error('Erro ao renovar token:', refreshError);
          window.location.href = '/login';
          return;
        }
      }

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
          setTimeout(() => window.location.href = '/login', 1500);
          return;
        }
        throw new Error(`Erro HTTP ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("image")) {
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        if (prevBlobRef.current) URL.revokeObjectURL(prevBlobRef.current);
        prevBlobRef.current = blobUrl;

        setImageUrl(blobUrl);

        // detecção de máscara
        try {
          const hasMask = await detectMaskFromBlob(blob);
          setDetectionMsg(hasMask ? "Placas detectadas" : "Nenhuma placa detectada");
        } catch {
          setDetectionMsg(null);
        }
      } else {
        const json = await res.json();
        setImageUrl(json.image_url || json.url || json.result || null);
      }
    } catch (err: any) {
      console.error(err);
      setError("Erro ao obter imagem: o número de requisições atingiu o limite. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  }

  async function detectMaskFromBlob(blob: Blob): Promise<boolean> {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(bitmap, 0, 0);

    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height).data;

    let count = 0;
    for (let i = 0; i < imageData.length; i += 400) {
      const r = imageData[i], g = imageData[i+1], b = imageData[i+2];
      if (r > 140 && b > 140 && g < 120) count++;
      if (count > 8) return true;
    }
    return false;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-green-700 to-green-900">
      
      {/* HERO */}
      <header className="text-white py-24 px-6 flex justify-center items-center bg-hero-pattern bg-cover bg-center">
        <div className="max-w-4xl text-center drop-shadow-xl">
          <h1 className="text-5xl md:text-6xl font-extrabold">Detecção Solar</h1>
          <p className="mt-3 text-lg opacity-90">
            Insira Latitude e Longitude para detectar placas solares via satélite.
          </p>
        </div>
      </header>

      {/* CARD CENTRAL */}
      <main className="flex-1 -mt-10 pb-16 px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10 border border-gray-100">

          {/* FORM */}
          <form onSubmit={handleDetect} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Latitude</span>
                <input
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="-23.550520"
                  className="px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-600 transition"
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-700">Longitude</span>
                <input
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  placeholder="-46.633308"
                  className="px-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-600 transition"
                />
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-700 hover:bg-green-800 transition text-white px-8 py-3 rounded-full font-semibold shadow-lg disabled:opacity-50"
              >
                {loading ? "Detectando..." : "Detectar"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLat(""); setLon(""); setImageUrl(null); setError("");
                }}
                className="text-sm text-gray-600 underline hover:text-gray-800"
              >
                Limpar
              </button>
            </div>

            {error && <p className="text-red-600 font-medium">{error}</p>}
          </form>

          {/* RESULTADO */}
          {imageUrl && (
            <div className="mt-10 space-y-4">
              <p className="text-sm text-gray-600">Resultado da análise:</p>

              <div className="border rounded-xl overflow-hidden shadow-sm">
                <img
                  src={imageUrl}
                  className="w-full object-contain max-h-[65vh] bg-gray-50"
                />

                {detectionMsg && (
                  <div className="p-3 text-center text-green-700 font-semibold bg-green-50 border-t">
                    {detectionMsg}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <a href={imageUrl} target="_blank" className="px-3 py-2 border rounded-lg hover:bg-gray-50">Abrir</a>
                <a href={imageUrl} download className="px-3 py-2 border rounded-lg hover:bg-gray-50">Baixar</a>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
