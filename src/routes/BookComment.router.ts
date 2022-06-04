/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import BookCommentController from "../controllers/BookComment.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";

/**
 * Router Definition
 */
const bookRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// GET book
bookRouter.get("/book/:id", BookCommentController.findAllFromBook);

// GET book/:id
bookRouter.get("/:id", BookCommentController.findById);

// POST book
//bookRouter.post("/", verifyJwt, BookCopyController.create);

// PUT book/:id
//bookRouter.put("/:id", verifyJwt, BookCopyController.update);

// DELETE book/:id
bookRouter.delete("/:id", verifyJwt, BookCommentController.delete);

export default bookRouter;
