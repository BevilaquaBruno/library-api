/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import GenreController from "../controllers/Genre.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";

/**
 * Router Definition
 */
const genreRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// GET genre
genreRouter.get("/", GenreController.findAll);

// GET genre/:id
genreRouter.get("/:id", GenreController.findById);

// POST genre
genreRouter.post("/", verifyJwt, GenreController.create);

// PUT genre/:id
genreRouter.put("/:id", verifyJwt, GenreController.update);

// DELETE genre/:id
genreRouter.delete("/:id", verifyJwt, GenreController.delete);

export default genreRouter;
