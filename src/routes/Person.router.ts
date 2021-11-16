/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import PersonController from "../controllers/Person.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";


/**
* Router Definition
*/
const personRouter: Router = express.Router();

/**
* Controller Definitions
*/
// GET people
personRouter.get("/", PersonController.findAll);

// GET person/:id
personRouter.get("/:id", PersonController.findById);

 // POST person
personRouter.post("/", verifyJwt, PersonController.create);

// PUT person/:id
personRouter.put("/:id", verifyJwt, PersonController.update);

// DELETE person/:id
personRouter.delete("/:id", verifyJwt, PersonController.delete);
export default personRouter;
