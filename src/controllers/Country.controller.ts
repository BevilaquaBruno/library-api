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

  public static async find(req: Request, res: Response) {
    let response: ResponseData;
    const id: number = parseInt(req.params.id, 10);

    try {
      const country: Country = await CountryModel.findById(id);
      if (0 == country.id) throw new Error("País não encontrado");
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

      if ("" == country.name) throw new Error("Informe o nome do país");
      if ("" == country.fullName) throw new Error("Informe o nome completo do país");
      if ("" == country.short) throw new Error("Informe a sigla do país");
      if ("" == country.flag) throw new Error("Faça o upload da bandeira do país");

      const insertId = await CountryModel.create(country);
      if (insertId > 0) {
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
      const countryUpdate: Country = new Country(
        req.body.name,
        req.body.fullName,
        req.body.short,
        req.body.flag,
        id
      );

      if ("" == countryUpdate.name) throw new Error("Informe o nome do país");
      if ("" == countryUpdate.fullName) throw new Error("Informe o nome completo do país");
      if ("" == countryUpdate.short) throw new Error("Informe a sigla do país");
      if ("" == countryUpdate.flag) throw new Error("Faça o upload da bandeira do país");

      const existingCountry = await CountryModel.findById(id);
      if (!(existingCountry.id > 0)) {
        throw new Error("País não encontrado");
      }

      const updatedCountry = await CountryModel.update(countryUpdate);
      if (true === updatedCountry)
        response = {
          data: countryUpdate.toJson(),
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
      if (!(country.id > 0)) throw new Error("País não encontrado");

      let result = await CountryModel.remove(country);
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
