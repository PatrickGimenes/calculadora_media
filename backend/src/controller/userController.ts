import { Request, Response } from "express";
import { pool } from "../config/database";
import { User } from "../models/user";
import { hashService } from "../core/services/hashService";

export const createUser = async (req: Request, res: Response) => {
  const { nome, email, pwd }: User = req.body;

  if (!email || !pwd || !nome) {
    return res.status(501).json({ message: "Todos os campos devem ser preenchidos" });
  }

  try {
    const pwd_hash = await hashService.hash(pwd);

    const [result] = await pool.query(
      "INSERT INTO tb_users (name, email, senha_hash) VALUES (?, ?, ?)",
      [nome, email, pwd_hash]
    );

    return res.status(201).json({
      id: (result as any).insertId,
      email,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating user", error });
  }
};
