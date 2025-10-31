import { Router } from "express";
import { calcularMedia } from "../controller/mediaController";
import { getAll } from "../controller/mediaController";
import { authenticate } from "../middleware/authenticate";

const routerMedia = Router();

routerMedia.post("/", authenticate, calcularMedia);
routerMedia.get("/notas", authenticate, getAll);

export default routerMedia;
