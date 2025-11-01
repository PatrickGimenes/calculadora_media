import { Request, Response } from "express";
import { pool } from "../config/database";
import { User } from "../models/user";

import { hashService } from "../core/services/hashService";

import { signAccessToken } from "../core/utils/jwtUtils";

export async function login(req: Request, res: Response) {
  const { email, pwd }: User = req.body;

  
  if (!email || !pwd) return res.status(400).json({ error: "Dados inválidos" });

  const [ rows ]= await pool.query<User[]>(
    "SELECT id, email, senha_hash FROM tb_users WHERE email = ?",
    [email]
  );

  const user:User = rows[0];
  // console.log( 'Usuário: ' + user)

  if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

  const match = await hashService.compare(pwd, user.senha_hash);

  if (!match) return res.status(401).json({ error: "Credenciais inválidas" });

  const accessToken = signAccessToken({ userId: user.id });

  res.json({
    accessToken,
    user: { id: user.id, email },
  });
}
