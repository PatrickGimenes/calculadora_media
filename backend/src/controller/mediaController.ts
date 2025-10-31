import { mediaService } from "../core/services/mediaService";
import { Request, Response } from "express";
import { pool } from "../config/database";

export const calcularMedia = async (req: Request, res: Response) => {
  const {
    nome,
    nota1,
    nota2,
    nota3,
    nota4,
  }: {
    nome: string;
    nota1: number;
    nota2: number;
    nota3: number;
    nota4: number;
  } = req.body;

  if (!nota1 || !nota2 || !nota3 || !nota4 || !nome) {
    res.status(501).json({ message: "Todos os campos devem ser preenchidos" });
  }

  try {
    const media = new mediaService(nota1, nota2, nota3, nota4);
    const finalMedia = media.calcMedia();
    const situacao = media.retornaSituacao(finalMedia);

    const [result] = await pool.query(
      "INSERT INTO tb_notas (nome, media, situacao) VALUES (?, ?, ?)",
      [nome, finalMedia, situacao]
    );

    res.status(201).json({
      message: "Registro inserido com sucesso",
      data: { nome, finalMedia, situacao },
    });
  } catch (error: any) {
    // Tratamento mais detalhado de erros
    if (error.code === "ER_BAD_FIELD_ERROR") {
      return res.status(500).json({ message: "Campo inválido na query SQL" });
    }
    if (error.code === "ER_NO_SUCH_TABLE") {
      return res.status(500).json({ message: "Tabela 'notas' não encontrada" });
    }

    console.error("Erro ao inserir no banco:", error);
    return res.status(500).json({
      message: "Erro interno ao salvar os dados",
      error: error.message,
    });
  }
};

export const getAll = async (_: Request, res: Response) => {
  try{
   const [notas, _] = await pool.query("SELECT * FROM tb_notas ORDER BY nome;");
   res.status(200).json(notas);

  }catch(error: any){
    return res.status(500).json({
      message: "Ocorreu um erro ao buscar as notas",
      error: error.message,
    });
  }
}
