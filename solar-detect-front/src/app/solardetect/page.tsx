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

  // Função para validar e formatar lat/lon
  function parseAndFormat(value: string | number, type: "lat" | "lon"): string | null {
    if (value === "" || value === null || value === undefined) return null;
    const normalized = String(value).replace(",", ".").trim();
    const n = parseFloat(normalized);
    if (Number.isNaN(n)) return null;

    if (type === "lat" && (n < -90 || n > 90)) return null;
    if (type === "lon" && (n < -180 || n > 180)) return null;

    return n.toFixed(6); // 6 casas decimais
  }

  // Função para renovar o token
  async function refreshToken() {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const userType = localStorage.getItem('userType');
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password'); // Ideal seria ter um refresh token

    if (!email || !password || !userType) {
      throw new Error('Dados de autenticação não encontrados');
    }

    const response = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, userType }),
    });

    if (!response.ok) {
      throw new Error('Falha ao renovar o token');
    }

    const data = await response.json();
    authService.setAuth(data);
    return data.token;
  }

  // Handler principal
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
      // Pega o token do authService
      let token = authService.getToken();

      // Se o token estiver próximo de expirar, tenta renovar
      if (token && authService.isTokenNearExpiration(token)) {
        try {
          token = await refreshToken();
        } catch (refreshError) {
          console.error('Erro ao renovar token:', refreshError);
          // Redireciona para login se não conseguir renovar
          window.location.href = '/login';
          return;
        }
      }
      
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          setError("Sessão expirada ou inválida. Por favor, faça login novamente.");
          // Redirecionar para login após 2 segundos
          setTimeout(() => {
            window.location.href = '/login';
          }, 2000);
          return;
        }
        throw new Error(`Erro HTTP ${res.status}`);
      }

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("image")) {
        // Resposta binária (imagem PNG)
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);

        // revoga URL anterior
        if (prevBlobRef.current) {
          try { URL.revokeObjectURL(prevBlobRef.current); } catch (_) {}
        }
        prevBlobRef.current = blobUrl;

        setImageUrl(blobUrl);

        // detecta se a imagem contém a máscara (pixels magenta)
        try {
          const hasMask = await detectMaskFromBlob(blob);
          if (!hasMask) {
            setDetectionMsg("Nenhuma placa detectada");
          } else {
            setDetectionMsg("Placas detectadas na imagem");
          }
        } catch (e) {
          // se falhar na detecção, não bloquear a exibição da imagem
          setDetectionMsg(null);
        }
      } else if (contentType.includes("application/json")) {
        // Caso o backend retorne JSON com URL
        const json = await res.json();
        setImageUrl(json.image_url || json.url || json.result || null);
      } else {
        const txt = await res.text();
        setError("Formato inesperado: " + txt.slice(0, 100));
      }
    } catch (err: any) {
      console.error(err);
      setError("Erro ao obter imagem: " + (err.message || err));
    } finally {
      setLoading(false);
    }
  }

  // detecta presença de máscara (magenta) na imagem - amostragem para performance
  async function detectMaskFromBlob(blob: Blob): Promise<boolean> {
    // cria um bitmap para desenhar em canvas
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(bitmap, 0, 0);

    // amostra pixels (não testar todos para performance)
    const samplePixels = 10000; // alvo de pixels amostrados
    const totalPixels = bitmap.width * bitmap.height;
    const step = Math.max(1, Math.floor(totalPixels / samplePixels));

    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height).data;
    let magentaCount = 0;
    let samples = 0;

    // percorre com passo
    for (let p = 0; p < totalPixels; p += step) {
      const idx = p * 4;
      const r = imageData[idx];
      const g = imageData[idx + 1];
      const b = imageData[idx + 2];

      // condição simples para cor magenta (alto R e B, baixo G)
      if (r > 140 && b > 140 && g < 120) {
        magentaCount++;
      }

      samples++;
      // se já encontrou pixels suficientes, assume que há máscara
      if (magentaCount > 8) break;
    }

    // heurística: se encontrou ao menos alguns pixels magenta na amostra
    return magentaCount > 8;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="hero-gradient text-white py-28 px-6 flex justify-center items-center">
        <div className="max-w-4xl text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg">
            Detecção por Imagem de Satélite
          </h1>
          <p className="mt-4 text-sm sm:text-base opacity-90">
            Insira coordenadas de Latitude e Longitude. Clique em{" "}
            <span className="font-semibold">Detectar</span> para visualizar a imagem.
          </p>
        </div>
      </header>

      {/* Form Section */}
      <main className="flex-1 bg-white -mt-12 pb-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleDetect} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col">
                <span className="text-sm font-medium mb-2">
                  Latitude (ex: -23.550520)
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="entre -90 e 90"
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </label>

              <label className="flex flex-col">
                <span className="text-sm font-medium mb-2">
                  Longitude (ex: -46.633308)
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  step="any"
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  placeholder="entre -180 e 180"
                  className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 rounded-full font-semibold shadow hover:bg-green-700 disabled:opacity-60"
              >
                {loading ? "Detectando..." : "Detectar"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setLat("");
                  setLon("");
                  setImageUrl(null);
                  setError("");
                }}
                className="text-sm text-gray-600 underline"
              >
                Limpar
              </button>
            </div>

            {error && <p className="text-red-600 mt-2">{error}</p>}
          </form>

          {/* Resultado */}
          <div className="mt-8">
            {imageUrl ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Imagem retornada pelo backend:</p>
                <div className="border rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Resultado de detecção"
                    className="w-full object-contain max-h-[60vh] bg-gray-50"
                  />
                  {detectionMsg && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800">
                      {detectionMsg}
                    </div>
                  )}
                </div>
                <div className="flex gap-3">
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm px-3 py-2 border rounded hover:bg-gray-50"
                  >
                    Abrir em nova aba
                  </a>
                  <a
                    href={imageUrl}
                    download
                    className="text-sm px-3 py-2 border rounded hover:bg-gray-50"
                  >
                    Baixar imagem
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Nenhuma imagem detectada ainda.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
