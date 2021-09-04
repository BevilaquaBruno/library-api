/**
 * Required External Modules and Interfaces
 */
import express, { Request, Response } from "express";
import CountryModel from '../models/Country.model';
import Country from '../classes/Country.class';
import { ResponseData } from "../interfaces/Common.interface";

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
  let response: ResponseData;
  try {
    const countries: Country[] = await countryModel.findAll();
    response = { data: countries.map(ct => ct.toJson()), status: { error: false, message: 'List of all countries'} };
  } catch (e) {
    response = { data:{}, status: { error: true, message: 'Something bad happened' } };
  }
  res.status(500).json(response);
});

// GET countries/:id
countriesRouter.get('/:id', async (req: Request, res: Response) =>{
  let response: ResponseData;
  const id: number = parseInt(req.params.id, 10);

  try {
    const country: Country | boolean = await countryModel.find(id);

    if (typeof country != "boolean") {
      return res.status(200).json({ data: country.toJson(), status: { error: false, message: 'Country finded'} });
    }

    response = { data: {}, status: { error: true, message: 'Country not found'} };
  } catch (e) {
    response = { data: {}, status: { error: true, message: 'Something bad happened' } };
  }
  res.status(500).json(response);
});

// POST countries
countriesRouter.post('/', async (req: Request, res: Response) => {
  let response: ResponseData;
  try {
    const country: Country = new Country(
      req.body.name,
      req.body.fullName,
      req.body.short,
      req.body.flag
    );

    if ("" == country.name)
      throw new Error("Informe o nome do país.");
    if ("" == country.fullName)
      throw new Error("Informe o nome completo do país.");
    if ("" == country.short)
      throw new Error("Informe a sigla do país.");
    if ("" == country.flag)
      throw new Error("Faça o upload da bandeira do país.");

    const insertId = await countryModel.create(country);
    if (insertId > 0) {
      country.id = insertId;
      response = { data: country.toJson(), status: { error: false, message: 'Country created'} };
    }else{
      throw new Error("Erro ao inserir país.");
    }
  } catch (e) {
    response = { data: {}, status: { error: true, message: (e as Error).message } };
  }
  res.status(201).json(response);
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