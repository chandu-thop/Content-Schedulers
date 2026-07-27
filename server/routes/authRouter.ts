import { Router } from "express";
import { register } from "node:module";
import { loginUser, registerUser } from "../controllers/authController.js";

const authRouter=Router();


authRouter.post("/register",registerUser);
authRouter.post("/login",loginUser);

export default authRouter;