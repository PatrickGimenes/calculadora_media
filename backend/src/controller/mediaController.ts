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

  if (!nota1 == null|| !nota2 == null || !nota3 == null || !nota4 ==null || !nome ) {
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

    return res.status(201).json({
      message: "Registro inserido com sucesso",
      data: { nome, finalMedia, situacao },
    });
  } catch (error: any) {
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
  try {
    const [notas, _] = await pool.query(
      "SELECT * FROM tb_notas ORDER BY situacao;"
    );
    res.status(200).json(notas);
  } catch (error: any) {
    return res.status(500).json({
      message: "Ocorreu um erro ao buscar as notas",
      error: error.message,
    });
  }
};

export const editMedia = async (req: Request, res: Response) => {
  const {
    nome,
    nota1,
    nota2,
    nota3,
    nota4,
    id,
  }: {
    nome: string;
    nota1: number;
    nota2: number;
    nota3: number;
    nota4: number;
    id: number;
  } = req.body;

  if (!nota1 || !nota2 || !nota3 || !nota4 || !nome || !id) {
    res.status(501).json({ message: "Todos os campos devem ser preenchidos" });
  }

  try {
    const media = new mediaService(nota1, nota2, nota3, nota4);
    const finalMedia = media.calcMedia();
    const situacao = media.retornaSituacao(finalMedia);

    const [result] = await pool.query(
      "UPDATE tb_notas SET nome =?, media=?, situacao = ? WHERE id = ?",
      [ nome, finalMedia, situacao, id]
    );
  } catch (err) {
    res
      .status(500)
      .json({ message: "Houve um erro para salvar a nova média", erro: err });
  }
};

export const deleteMedia = async (req: Request, res: Response) => {
  const mediaId = req.body;
  if (!mediaId) return res.status(403).json({ message: "É necessário enviar o ID" });

  try {
    await pool.query("DELETE FROM tb_notas WHERE id = ?", [mediaId.id]);
    
    return res.status(200).json({ message: "Média excluída com sucesso!" });
  } catch (err) {
    return res.status(500).json({
      message: "Houve um erro ao excluir a média",
      Erro: err,
    });
  }
};
