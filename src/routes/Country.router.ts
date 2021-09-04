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
  res.json(response);
});

// GET countries/:id
countriesRouter.get('/:id', async (req: Request, res: Response) =>{
  let response: ResponseData;
  const id: number = parseInt(req.params.id, 10);

  try {
    const country: Country | boolean = await countryModel.findById(id);

    if (typeof country != "boolean") {
      return res.status(200).json({ data: country.toJson(), status: { error: false, message: 'Country finded'} });
    }

    response = { data: {}, status: { error: true, message: 'Country not found'} };
  } catch (e) {
    response = { data: {}, status: { error: true, message: 'Something bad happened' } };
  }
  res.json(response);
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
  res.json(response);
});

// PUT countries/:id
countriesRouter.put('/:id', async (req: Request, res: Response) => {
  let response: ResponseData;
  try {
    const id: number = parseInt(req.params.id);
    const countryUpdate: Country = new Country(
      req.body.name,
      req.body.fullName,
      req.body.short,
      req.body.flag,
      id
    );

    if ("" == countryUpdate.name)
      throw new Error("Informe o nome do país.");
    if ("" == countryUpdate.fullName)
      throw new Error("Informe o nome completo do país.");
    if ("" == countryUpdate.short)
      throw new Error("Informe a sigla do país.");
    if ("" == countryUpdate.flag)
      throw new Error("Faça o upload da bandeira do país.");

    const existingCountry = await countryModel.findById(id);
    if (!(existingCountry.id > 0)) {
      throw new Error("País não encontrado!");
    }
    const updatedCountry = await countryModel.update(countryUpdate);
    if (true === updatedCountry) {
      response = { data: countryUpdate.toJson(), status: { error: false, message: 'Country updated'} };
    }else{
      throw new Error("Erro ao atualizar país");
    }
  } catch (e) {
    response = { data: {}, status: { error: true, message: (e as Error).message } };
  }
  res.json(response);
});

// DELETE countries/:id
countriesRouter.delete('/:id', async (req: Request, res: Response) => {
  let response: ResponseData;
  try {
    const id: number = parseInt(req.params.id, 10);
    let country: Country = await countryModel.findById(id);
    console.log(country);
    if (!(country.id > 0))
      throw new Error("País não encontrado");
    let result = await countryModel.remove(country);
    if (true === result)
      response = { data: {}, status: { error: false, message: 'Country removed' } };
    else
      throw new Error("Erro ao deletar país.");
  } catch (e) {
    console.log(e);
    
    response = { data:{}, status: { error: true, message: (e as Error).message } };
  }
  res.json(response);
});

export default countriesRouter;