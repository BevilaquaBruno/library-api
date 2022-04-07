/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import BookController from "../controllers/Book.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";

/**
 * Router Definition
 */
const bookRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// GET book
bookRouter.get("/", BookController.findAll);

// GET book/:id
bookRouter.get("/:id", BookController.findById);

// POST book
bookRouter.post("/", verifyJwt, BookController.create);

// PUT book/:id
bookRouter.put("/:id", verifyJwt, BookController.update);

// DELETE book/:id
//bookRouter.delete("/:id", verifyJwt, BookController.delete);

export default bookRouter;
