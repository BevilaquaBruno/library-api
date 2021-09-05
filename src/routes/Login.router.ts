/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import LoginController from "../controllers/Login.controller";

/**
 * Router Definition
 */
const loginRouter = express.Router();

/**
 * Controller Definitions
 */
// POST login
loginRouter.post('/', LoginController.login);

export default loginRouter;