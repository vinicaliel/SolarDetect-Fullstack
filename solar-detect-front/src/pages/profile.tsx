import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// caminho relativo a partir de src/pages -> src/app/login/UserProfileForm.tsx
const UserProfileForm = dynamic(() => import("../app/login/UserProfileForm"), { ssr: false });

export default function ProfilePage() {
  const [initial, setInitial] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Falha ao carregar usuário");
        const data = await res.json();
        setInitial(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <main>
      {loading ? (
        <div style={{ padding: 40 }}>Carregando perfil...</div>
      ) : (
        <UserProfileForm initial={initial} />
      )}
    </main>
  );
}