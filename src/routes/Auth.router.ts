/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import AuthController from "../controllers/Auth.controller";

/**
 * Router Definition
 */
const authRouter = express.Router();

/**
 * Controller Definitions
 */
// POST login
authRouter.post('/login', AuthController.login);
// GET logout
authRouter.get('/logout', AuthController.logout);

export default authRouter;
