/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import  * as CountryService from './countries.service';
import { BaseCountry, Country } from "./country.interface";

/**
 * Router Definition
 */
const countriesRouter = express.Router();

/**
 * Controller Definitions
 */

// GET countries
countriesRouter.get('/', async (req: Request, res: Response) =>{
  try {
    const countries: Country[] = await CountryService.findAll();

    res.status(200).json({ data: countries, status: { error: false, message: 'All countries'} });
  } catch (e) {
    res.status(500).json({ status: { error: true, message: 'Someting bad happens'} });
  }
});

// GET countries/:id

// POST countries

// PUT countries/:id

// DELETE countries/:id