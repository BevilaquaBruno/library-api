/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import AuthController from "../controllers/Auth.controller";

/**
 * Router Definition
 */
const authRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// POST login
authRouter.post("/login", AuthController.login);

// GET logout
authRouter.get("/logout", AuthController.logout);

export default authRouter;
