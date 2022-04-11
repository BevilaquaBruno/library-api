/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import IdiomController from "../controllers/Idiom.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";

/**
 * Router Definition
 */
const idiomRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// GET idiom
idiomRouter.get("/", IdiomController.findAll);

// GET idiom/:id
idiomRouter.get("/:id", IdiomController.findById);

// POST idiom
idiomRouter.post("/", verifyJwt, IdiomController.create);

// PUT idiom/:id
idiomRouter.put("/:id", verifyJwt, IdiomController.update);

// DELETE idiom/:id
idiomRouter.delete("/:id", verifyJwt, IdiomController.delete);

export default idiomRouter;
