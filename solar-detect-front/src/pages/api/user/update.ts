import type { NextApiRequest, NextApiResponse } from "next";
import { storedUser } from "../../../lib/user/data";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const payload = req.body;
    // Atualiza somente campos enviados
    Object.assign(storedUser, payload);
    return res.status(200).json(storedUser);
  } catch (err) {
    return res.status(400).json({ error: "payload inválido" });
  }
}