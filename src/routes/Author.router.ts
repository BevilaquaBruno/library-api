/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import AuthorController from "../controllers/Author.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";

/**
 * Router Definition
 */
const authorsRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// GET authors
authorsRouter.get("/", AuthorController.findAll);

// GET authors/:id
authorsRouter.get("/:id", AuthorController.findById);

// POST authors
authorsRouter.post("/", verifyJwt, AuthorController.create);

// PUT authors/:id
authorsRouter.put("/:id", verifyJwt, AuthorController.update);

// DELETE authors/:id
authorsRouter.delete("/:id", verifyJwt, AuthorController.delete);

export default authorsRouter;
