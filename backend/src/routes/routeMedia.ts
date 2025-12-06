import { Router } from "express";
import {
  calcularMedia,
  deleteMedia,
  editMedia,
} from "../controller/mediaController";
import { getAll } from "../controller/mediaController";
import { authenticate } from "../middleware/authenticate";

const routerMedia = Router();

routerMedia.post("/", authenticate, calcularMedia);
routerMedia.get("/notas", authenticate, getAll);
routerMedia.delete("/notas/deletar", authenticate, deleteMedia);
routerMedia.delete("/notas/editar", authenticate, editMedia);

export default routerMedia;
