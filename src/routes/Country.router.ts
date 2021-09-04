/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import CountryController from "../controllers/Country.controller";

/**
 * Router Definition
 */
const countriesRouter = express.Router();

/**
 * Controller Definitions
 */
// GET countries
countriesRouter.get('/', CountryController.findAll);

// GET countries/:id
countriesRouter.get('/:id', CountryController.find);

// POST countries
countriesRouter.post('/', CountryController.create);

// PUT countries/:id
countriesRouter.put('/:id', CountryController.update);

// DELETE countries/:id
countriesRouter.delete('/:id', CountryController.delete);

export default countriesRouter;