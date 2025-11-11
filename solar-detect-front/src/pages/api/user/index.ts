import type { NextApiRequest, NextApiResponse } from "next";
import { storedUser } from "../../../lib/user/data";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();
  res.status(200).json(storedUser);
}