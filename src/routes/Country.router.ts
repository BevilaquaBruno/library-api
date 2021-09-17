/**
 * Required External Modules and Interfaces
 */
import express, { Router } from "express";
import CountryController from "../controllers/Country.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";

/**
 * Router Definition
 */
const countriesRouter: Router = express.Router();

/**
 * Controller Definitions
 */
// GET countries
countriesRouter.get("/", CountryController.findAll);

// GET countries/:id
countriesRouter.get("/:id", CountryController.findById);

// POST countries
countriesRouter.post("/", verifyJwt, CountryController.create);

// PUT countries/:id
countriesRouter.put("/:id", verifyJwt, CountryController.update);

// DELETE countries/:id
countriesRouter.delete("/:id", verifyJwt, CountryController.delete);

export default countriesRouter;
