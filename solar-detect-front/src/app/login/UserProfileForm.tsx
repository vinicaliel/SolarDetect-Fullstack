import React, { useEffect, useState } from "react";

type UserType = "company" | "student" | "other";

type UserProfile = {
  id?: string;
  name: string;
  email: string;
  userType: UserType;
  bio?: string;
  // company fields
  companyName?: string;
  cnpj?: string;
  website?: string;
  // student fields
  university?: string;
  course?: string;
  graduationYear?: string;
};

export default function UserProfileForm({ initial }: { initial?: UserProfile }) {
  const [user, setUser] = useState<UserProfile>(
    initial ?? {
      name: "",
      email: "",
      userType: "other",
      bio: "",
    }
  );
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initial) setUser(initial);
  }, [initial]);

  function onChange<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setUser((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [String(key)]: "" }));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!user.name || user.name.trim().length < 2) e.name = "Nome é obrigatório";
    if (!user.email || !/^\S+@\S+\.\S+$/.test(user.email)) e.email = "Email inválido";
    if (user.userType === "company") {
      if (!user.companyName || user.companyName.trim().length < 2) e.companyName = "Razão social é obrigatória";
      // basic CNPJ length check (only formatting-agnostic)
      if (user.cnpj && user.cnpj.replace(/\D/g, "").length !== 14) e.cnpj = "CNPJ deve ter 14 dígitos (somente números)";
    }
    if (user.userType === "student") {
      if (!user.university) e.university = "Universidade é obrigatória";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    if (!validate()) {
      setMessage("Corrija os erros antes de salvar.");
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Erro ao salvar");
      }
      const saved = await res.json();
      setUser(saved);
      setMessage("Salvo com sucesso.");
      setEditing(false);
    } catch (err: any) {
      setMessage("Erro ao salvar: " + (err.message ?? err));
    } finally {
      setLoading(false);
    }
  }

  const fieldStyle: React.CSSProperties = { display: "flex", flexDirection: "column", marginBottom: 8 };
  const inputProps = (disabled = false) => ({ disabled, style: { padding: 8, borderRadius: 4, border: "1px solid #ddd" } });

  const userTypeLabel = user.userType === "company" ? "Empresa" : user.userType === "student" ? "Estudante" : "Outro";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Perfil do usuário</h1>
        <div>
          <button onClick={() => { setEditing((v) => !v); setMessage(null); }} style={{ marginRight: 8 }}>
            {editing ? "Cancelar" : "Editar"}
          </button>
          {editing && (
            <button onClick={handleSave} disabled={loading} style={{ background: "#0366d6", color: "#fff", padding: "8px 12px", borderRadius: 4 }}>
              {loading ? "Salvando..." : "Salvar"}
            </button>
          )}
        </div>
      </header>

      <section style={{ marginTop: 16, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 0 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <label style={fieldStyle}>
            <span>Nome</span>
            <input
              {...inputProps(!editing)}
              value={user.name}
              onChange={(e) => onChange("name", e.target.value)}
            />
            {errors.name && <small style={{ color: "crimson" }}>{errors.name}</small>}
          </label>

          <label style={fieldStyle}>
            <span>Email</span>
            <input
              {...inputProps(!editing)}
              value={user.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
            {errors.email && <small style={{ color: "crimson" }}>{errors.email}</small>}
          </label>

          <label style={fieldStyle}>
            <span>Tipo de usuário</span>
            {/* Campo não editável: mostra o tipo atual como input disabled */}
            <input
              value={userTypeLabel}
              disabled
              style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd", background: "#f5f5f5" }}
              aria-readonly
            />
          </label>

          <label style={fieldStyle}>
            <span>Biografia</span>
            <textarea
              {...inputProps(!editing)}
              value={user.bio ?? ""}
              onChange={(e) => onChange("bio", e.target.value)}
              rows={3}
            />
          </label>
        </div>

        {/* Company view */}
        {user.userType === "company" && (
          <div style={{ marginTop: 16 }}>
            <h3>Dados da Empresa</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={fieldStyle}>
                <span>Razão social</span>
                <input
                  {...inputProps(!editing)}
                  value={user.companyName ?? ""}
                  onChange={(e) => onChange("companyName", e.target.value)}
                />
                {errors.companyName && <small style={{ color: "crimson" }}>{errors.companyName}</small>}
              </label>

              <label style={fieldStyle}>
                <span>CNPJ</span>
                <input
                  {...inputProps(!editing)}
                  value={user.cnpj ?? ""}
                  onChange={(e) => onChange("cnpj", e.target.value)}
                />
                {errors.cnpj && <small style={{ color: "crimson" }}>{errors.cnpj}</small>}
              </label>

              <label style={fieldStyle}>
                <span>Website</span>
                <input
                  {...inputProps(!editing)}
                  value={user.website ?? ""}
                  onChange={(e) => onChange("website", e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        {/* Student view */}
        {user.userType === "student" && (
          <div style={{ marginTop: 16 }}>
            <h3>Dados do Estudante</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <label style={fieldStyle}>
                <span>Universidade</span>
                <input
                  {...inputProps(!editing)}
                  value={user.university ?? ""}
                  onChange={(e) => onChange("university", e.target.value)}
                />
                {errors.university && <small style={{ color: "crimson" }}>{errors.university}</small>}
              </label>

              <label style={fieldStyle}>
                <span>Curso</span>
                <input
                  {...inputProps(!editing)}
                  value={user.course ?? ""}
                  onChange={(e) => onChange("course", e.target.value)}
                />
              </label>

              <label style={fieldStyle}>
                <span>Ano de formatura</span>
                <input
                  {...inputProps(!editing)}
                  value={user.graduationYear ?? ""}
                  onChange={(e) => onChange("graduationYear", e.target.value)}
                />
              </label>
            </div>
          </div>
        )}

        {message && <p style={{ marginTop: 12 }}>{message}</p>}
      </section>
    </div>
  );
}