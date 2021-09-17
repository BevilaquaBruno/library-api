import { Request, Response } from "express";
import CountryModel from "../models/Country.model";
import Country from "../classes/Country.class";
import { ResponseData } from "../interfaces/Common.interface";

export default class CountryController {
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const countries: Country[] = await CountryModel.findAll();
      response = {
        data: countries.map((ct) => ct.toJson()),
        status: { error: false, message: "Lista de todos os países" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados dos países",
        },
      };
    }

    res.json(response);
  }

  public static async findById(req: Request, res: Response) {
    let response: ResponseData;
    const id: number = parseInt(req.params.id, 10);

    try {
      const country: Country = await CountryModel.findById(id);
      if (0 === country.id) throw new Error("País não encontrado");
      response = { data: country.toJson(), status: { error: false, message: "País encontrado" } };
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao buscar dados do país" },
      };
    }

    res.json(response);
  }

  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const country: Country = new Country(
        req.body.name,
        req.body.fullName,
        req.body.short,
        req.body.flag
      );

      const resValidate: ResponseData = country.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let countryValidate: Country;
      countryValidate = await CountryModel.findByName(country.name);
      if (0 !== countryValidate.id) throw new Error("Já existe um país com esse nome");
      countryValidate = await CountryModel.findByFullName(country.fullName);
      if (0 !== countryValidate.id) throw new Error("Já existe um país com esse nome completo");
      countryValidate = await CountryModel.findByShort(country.short);
      if (0 !== countryValidate.id) throw new Error("Já existe um país com essa sigla");

      const insertId = await CountryModel.create(country);
      if (insertId !== 0) {
        country.id = insertId;
        response = { data: country.toJson(), status: { error: false, message: "País cadastrado" } };
      } else throw new Error("Erro ao inserir país");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar país" },
      };
    }

    res.json(response);
  }

  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const id: number = parseInt(req.params.id);
      const country: Country = new Country(
        req.body.name,
        req.body.fullName,
        req.body.short,
        req.body.flag,
        id
      );

      const existingCountry = await CountryModel.findById(id);
      if (0 === existingCountry.id) throw new Error("País não encontrado");

      const resValidate: ResponseData = country.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let countryValidate: Country;
      countryValidate = await CountryModel.findByName(country.name, country.id);
      if (0 !== countryValidate.id) throw new Error("Já existe um país com esse nome");
      countryValidate = await CountryModel.findByFullName(country.fullName, country.id);
      if (0 !== countryValidate.id) throw new Error("Já existe um país com esse nome completo");
      countryValidate = await CountryModel.findByShort(country.short, country.id);
      if (0 !== countryValidate.id) throw new Error("Já existe um país com essa sigla");

      const updatedCountry = await CountryModel.update(country);
      if (true === updatedCountry)
        response = {
          data: country.toJson(),
          status: { error: false, message: "País atualizado" },
        };
      else throw new Error("Erro ao atualizar país");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro alterar país" },
      };
    }

    res.json(response);
  }

  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const id: number = parseInt(req.params.id, 10);
      let country: Country = await CountryModel.findById(id);
      if (country.id === 0) throw new Error("País não encontrado");

      let result = await CountryModel.delete(country);
      if (true === result)
        response = { data: {}, status: { error: false, message: "País removido" } };
      else throw new Error("Erro ao deletar país");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao excluir país" },
      };
    }

    res.json(response);
  }
}
