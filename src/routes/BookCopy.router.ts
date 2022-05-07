/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import BookCopyController from "../controllers/BookCopy.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";

/**
 * Router Definition
 */
const bookRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// GET book
bookRouter.get("/", BookCopyController.findAll);

// GET book/:id
bookRouter.get("/:id", BookCopyController.findById);

// POST book
bookRouter.post("/", verifyJwt, BookCopyController.create);

// PUT book/:id
bookRouter.put("/:id", verifyJwt, BookCopyController.update);

// DELETE book/:id
bookRouter.delete("/:id", verifyJwt, BookCopyController.delete);

export default bookRouter;
