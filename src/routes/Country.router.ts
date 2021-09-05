/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import CountryController from "../controllers/Country.controller";
import { verifyJwt } from "../middlewares/verify-jwt.middleware";

/**
 * Router Definition
 */
const countriesRouter = express.Router();

/**
 * Controller Definitions
 */
// GET countries
countriesRouter.get('/', verifyJwt, CountryController.findAll);

// GET countries/:id
countriesRouter.get('/:id', verifyJwt, CountryController.find);

// POST countries
countriesRouter.post('/', verifyJwt, CountryController.create);

// PUT countries/:id
countriesRouter.put('/:id', verifyJwt, CountryController.update);

// DELETE countries/:id
countriesRouter.delete('/:id', verifyJwt, CountryController.delete);

export default countriesRouter;