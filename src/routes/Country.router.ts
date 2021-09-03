/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import CountryModel from '../models/Country.model';
import Country from '../classes/Country.class';

const countryModel = new CountryModel();
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
    const countries: Country[] = await countryModel.findAll();

    res.status(200).json({ data: countries.map(ct => ct.toJson()), status: { error: false, message: 'List of all countries'} });
  } catch (e) {
    res.status(500).json({ status: { error: true, message: 'Something bad happened' } });
  }
});

// GET countries/:id
countriesRouter.get('/:id', async (req: Request, res: Response) =>{
  const id: number = parseInt(req.params.id, 10);

  try {
    const country: Country | boolean = await countryModel.find(id);

    if (typeof country != "boolean") {
      return res.status(200).json({ data: country, status: { error: false, message: 'Country finded'} });
    }

    res.status(400).json({ status: { error: true, message: 'Country not found'} });
  } catch (e) {
    res.status(500).json({ status: { error: true, message: 'Something bad happened' } });
  }
});

// POST countries
countriesRouter.post('/', async (req: Request, res: Response) => {
  try {
    const country: Country = new Country(
      req.body.name,
      req.body.fullName,
      req.body.short,
      req.body.flag
    );

    const newCountry = await countryModel.create(country);

    res.status(201).json({ data: country, status: { error: false, message: 'Country created'} });
  } catch (e) {
    res.status(500).json({ status: { error: true, message: 'Something bad happened'} });
  }
});

// PUT countries/:id
countriesRouter.put('/:id', async (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);

  try {
    const countryUpdate: Country = new Country(
      req.body.name,
      req.body.fullName,
      req.body.short,
      req.body.flag,
      id
    );

    const existingCountry = await countryModel.find(id);

    if (existingCountry) {
      const updatedCountry = await countryModel.update(countryUpdate);
      return res.status(200).json({ data: updatedCountry, status: { error: false, message: 'Country updated'} });
    }

    res.status(400).json({ status: { error: true, message: 'Country not found'} });
  } catch (e) {
    res.status(500).json({ status: { error: true, message: 'Something bad happened'} });
  }
});

// DELETE countries/:id
countriesRouter.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id: number = parseInt(req.params.id, 10);
    let country: Country | boolean = await countryModel.find(id);
    if (typeof country != "boolean") {
      await countryModel.remove(country);
    }
    res.status(200).json({ status: { error: false, message: 'Country removed'} });
  } catch (e) {
    console.log(e);
    res.status(500).json({ status: { error: true, message: 'Something bad happened'} });
  }
});

export default countriesRouter;