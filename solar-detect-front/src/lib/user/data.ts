export type UserProfile = {
  id?: string;
  name: string;
  email: string;
  userType: "company" | "student" | "other";
  bio?: string;
  companyName?: string;
  cnpj?: string;
  website?: string;
  university?: string;
  course?: string;
  graduationYear?: string;
};

// Dados em memória para desenvolvimento local
export let storedUser: UserProfile = {
  id: "1",
  name: "João Silva",
  email: "joao@example.com",
  userType: "student",
  bio: "Pesquisador em energia solar.",
  university: "Universidade Exemplo",
  course: "Engenharia Elétrica",
  graduationYear: "2026",
};