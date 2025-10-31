import { Router } from "express";
import { createUser } from "../controller/userController";
import { login } from "../controller/authController";


const routerUser = Router();

routerUser.post('/login', login);
routerUser.post('/cadastro', createUser);



export default routerUser;