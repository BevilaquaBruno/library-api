/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import PublisherController from "../controllers/Publisher.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";

/**
 * Router Definition
 */
const publisherRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// GET publisher
publisherRouter.get("/", PublisherController.findAll);

// GET publisher/:id
publisherRouter.get("/:id", PublisherController.findById);

// POST publisher
publisherRouter.post("/", verifyJwt, PublisherController.create);

// PUT publisher/:id
publisherRouter.put("/:id", verifyJwt, PublisherController.update);

// DELETE publisher/:id
publisherRouter.delete("/:id", verifyJwt, PublisherController.delete);

export default publisherRouter;
