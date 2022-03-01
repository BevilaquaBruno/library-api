/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import StyleController from "../controllers/Style.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";

/**
 * Router Definition
 */
const styleRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// GET style
styleRouter.get("/", StyleController.findAll);

// GET style/:id
styleRouter.get("/:id", StyleController.findById);

// POST style
styleRouter.post("/", verifyJwt, StyleController.create);

// PUT style/:id
styleRouter.put("/:id", verifyJwt, StyleController.update);

// DELETE style/:id
styleRouter.delete("/:id", verifyJwt, StyleController.delete);

export default styleRouter;
