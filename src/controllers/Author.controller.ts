import { Request, Response } from "express";
import AuthorModel from "../models/Author.model";
import Author from "../classes/Author.class";
import { ResponseData } from "../interfaces/Common.interface";
import Country from "../classes/Country.class";
import CountryModel from "../models/Country.model";

/**
 * AuthorController class is used for /api/author route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class AuthorController {
  /**
   * List all authors
   */
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get author in database
      const author: Author[] = await AuthorModel.findAll();

      /**
       * 2. map then to get the @toJson data
       */
      response = {
        data: author.map((ct) => ct.toJson()),
        status: { error: false, message: "Lista de todos os autores" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados dos autores",
        },
      };
    }

    res.json(response);
  }

  /**
   * List the author with the given id
   * id: author's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the id from url
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. find(or not) the id with the parsed id
      const author: Author = await AuthorModel.findById(id);
      //3. validate if the author exists or not in the database
      if (0 === author.id) throw new Error("Autor não encontrado");
      /**
       * 4. get the @toJson data
       */
      response = {
        data: author.toJson(),
        status: { error: false, message: "Autor encontrado" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados do autor",
        },
      };
    }

    res.json(response);
  }

  /**
   * Create a author
   * name: name of the author
   * fullName: full name of the author
   * birth_date: birth date of the author;
   * death_date: death date of the author;
   * born_place: born place of the author;
   * death_place: born place of the author;
   * born_country: born country of the author;
   * death_country: death country of the author;
   */
  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and create a author with the given data
      let born_country: Country | null =
        "" === req.body.born_country_id
          ? null
          : await CountryModel.findById(req.body.born_country_id);
      let death_country: Country | null =
        "" === req.body.death_country_id
          ? null
          : await CountryModel.findById(req.body.death_country_id);
      const author: Author = new Author(
        req.body.name,
        req.body.fullName,
        req.body.birth_date,
        req.body.death_date,
        req.body.born_place,
        req.body.death_place,
        born_country,
        death_country
      );

      //2. validate author data
      const resValidate: ResponseData = author.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      //3. insert the author
      const insertId: number = await AuthorModel.create(author);

      //4. validate insertion
      if (insertId !== 0) {
        author.id = insertId;
        response = {
          data: author.toJson(),
          status: { error: false, message: "Autor cadastrado" },
        };
      } else throw new Error("Erro ao inserir autor");
    } catch (e: any) {
      console.log(e);
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar autor" },
      };
    }

    res.json(response);
  }

  /**
   * Update a author
   * id: id of the author - 1 IN URL
   * name: name of the author - Machado de Assis
   * fullName: full name of the author
   * birth_date: birth date of the author;
   * death_date: death date of the author;
   * born_place: born place of the author;
   * death_place: born place of the author;
   * born_country: born country of the author;
   * death_country: death country of the author;
   */
  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id in the url
      const id: number = parseInt(req.params.id);

      //2. get and create a author with the given data
      let born_country: Country | null =
        "" === req.body.born_country_id
          ? null
          : await CountryModel.findById(req.body.born_country_id);
      let death_country: Country | null =
        "" === req.body.death_country_id
          ? null
          : await CountryModel.findById(req.body.death_country_id);
      const author: Author = new Author(
        req.body.name,
        req.body.fullName,
        req.body.birth_date,
        req.body.death_date,
        req.body.born_place,
        req.body.death_place,
        born_country,
        death_country,
        id
      );

      //3. validate if a author with the given id exists
      const existingAuthor: Author = await AuthorModel.findById(id);
      if (0 === existingAuthor.id) throw new Error("Autor não encontrado");

      //4. validate author data
      const resValidate: ResponseData = author.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      //5. update author
      const updpatedAuthor: boolean = await AuthorModel.update(author);

      //6. validate the update
      if (true === updpatedAuthor)
        response = {
          data: author.toJson(),
          status: { error: false, message: "Autor atualizado" },
        };
      else throw new Error("Erro ao atualizar autor");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro alterar autor" },
      };
    }

    res.json(response);
  }

  /**
   * delete a author
   * id: id of the author
   */
  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id
      const id: number = parseInt(req.params.id, 10);
      //2. validate if exists a author with the given id
      let author: Author = await AuthorModel.findById(id);
      if (author.id === 0) throw new Error("Autor não encontrado");

      //3. delete author
      let result: boolean = await AuthorModel.delete(author);

      //4. validate deletion
      if (true === result)
        response = { data: {}, status: { error: false, message: "Autor removido" } };
      else throw new Error("Erro ao deletar autor");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao excluir autor" },
      };
    }

    res.json(response);
  }
}
