"use client";
import { useState, FormEvent } from "react";

export default function SolarDetect() {
  const [lat, setLat] = useState<string>("");
  const [lon, setLon] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

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
      const res = await fetch(url);

      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

      const contentType = res.headers.get("content-type") || "";

      if (contentType.includes("image")) {
        // Resposta binária (imagem PNG)
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        setImageUrl(blobUrl);
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
