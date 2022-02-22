import { Request, Response } from "express";
import CountryModel from "../models/Country.model";
import Country from "../classes/Country.class";
import { ResponseData } from "../interfaces/Common.interface";

/**
 * CountryController class is used for /api/country route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class CountryController {
  /**
   * List all countries
   */
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get countries in database
      const countries: Country[] = await CountryModel.findAll();

      /**
       * 2. map then to get the @toJson data
       */
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

  /**
   * List the country with the given id
   * id: country's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the id from url
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. find(or not) the id with the parsed id
      const country: Country = await CountryModel.findById(id);
      //3. validate if the country exists or not in the database
      if (0 === country.id) throw new Error("País não encontrado");
      /**
       * 4. get the @toJson data
       */
      response = { data: country.toJson(), status: { error: false, message: "País encontrado" } };
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao buscar dados do país" },
      };
    }

    res.json(response);
  }

  /**
   * Create a country
   * name: name of the country - Brazil
   * fullName: fullname of the country - Federative Republic of Brazil
   * short: short of the country: - BRA
   * flag: file name of the flag - {random}.{png,svg,jpg,jpeg}
   */
  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and create a country with the given data
      const country: Country = new Country(
        req.body.name,
        req.body.fullName,
        req.body.short,
        req.body.flag
      );

      //2. validate country data
      const resValidate: ResponseData = country.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let countryValidate: Country;
      //3. validate name of the country
      countryValidate = await CountryModel.findByName(country.name);
      if (0 !== countryValidate.id) throw new Error("Já existe um país com esse nome");
      //4. validate fullName of the country
      if (null != country.fullName) {
        countryValidate = await CountryModel.findByFullName(country.fullName);
        if (0 !== countryValidate.id) throw new Error("Já existe um país com esse nome completo");
      }
      //5. validate short of the country
      countryValidate = await CountryModel.findByShort(country.short);
      if (0 !== countryValidate.id) throw new Error("Já existe um país com essa sigla");

      //6. insert the country
      const insertId: number = await CountryModel.create(country);

      //7. validate insertion
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

  /**
   * Create a country
   * id: id of the country - 1 IN URL
   * name: name of the country - Brazil
   * fullName: fullname of the country - Federative Republic of Brazil
   * short: short of the country: - BRA
   * flag: file name of the flag - {random}.{png,svg,jpg,jpeg}
   */
  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id in the url
      const id: number = parseInt(req.params.id);

      //2. get and create a country with the given data
      const country: Country = new Country(
        req.body.name,
        req.body.fullName,
        req.body.short,
        req.body.flag,
        id
      );

      //3. validate if a country with the given id exists
      const existingCountry: Country = await CountryModel.findById(id);
      if (0 === existingCountry.id) throw new Error("País não encontrado");

      //4. validate country data
      const resValidate: ResponseData = country.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let countryValidate: Country;
      //5. validate name of the country
      countryValidate = await CountryModel.findByName(country.name, country.id);
      if (0 !== countryValidate.id) throw new Error("Já existe um país com esse nome");
      //6. validate fullName of the country
      if (null != country.fullName) {
        countryValidate = await CountryModel.findByFullName(country.fullName, country.id);
        if (0 !== countryValidate.id) throw new Error("Já existe um país com esse nome completo");
      }
      //7. validate short of the country
      countryValidate = await CountryModel.findByShort(country.short, country.id);
      if (0 !== countryValidate.id) throw new Error("Já existe um país com essa sigla");

      //8. update country
      const updatedCountry: boolean = await CountryModel.update(country);

      //9. validate the update
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

  /**
   * delete a country
   * id: id of the country
   */
  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id
      const id: number = parseInt(req.params.id, 10);
      //2. validate if exists a country with the given id
      let country: Country = await CountryModel.findById(id);
      if (country.id === 0) throw new Error("País não encontrado");

      //3. delete country
      let result: boolean = await CountryModel.delete(country);

      //4. validate deletion
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
