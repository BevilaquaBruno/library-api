import { Request, Response } from "express";
import GenreModel from "../models/Genre.model";
import Genre from "../classes/Genre.class";
import { ResponseData } from "../interfaces/Common.interface";

/**
 * GenreController class is used for /api/genre route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class GenreController {
  /**
   * List all genres
   */
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get genre in database
      const genre: Genre[] = await GenreModel.findAll();

      /**
       * 2. map then to get the @toJson data
       */
      response = {
        data: genre.map((ct) => ct.toJson()),
        status: { error: false, message: "Lista de todos os gêneros" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados dos gêneros",
        },
      };
    }

    res.json(response);
  }

  /**
   * List the genre with the given id
   * id: genre's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the id from url
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. find(or not) the id with the parsed id
      const genre: Genre = await GenreModel.findById(id);
      //3. validate if the genre exists or not in the database
      if (0 === genre.id) throw new Error("Gênero não encontrado");
      /**
       * 4. get the @toJson data
       */
      response = { data: genre.toJson(), status: { error: false, message: "Gênero encontrado" } };
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao buscar dados do gênero" },
      };
    }

    res.json(response);
  }

  /**
   * Create a genre
   * description: description of the genre
   */
  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and create a genre with the given data
      const genre: Genre = new Genre(req.body.description);

      //2. validate genre data
      const resValidate: ResponseData = genre.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let genreValidate: Genre;
      //3. validate name of the genre
      genreValidate = await GenreModel.findByDescription(genre.description);
      if (0 !== genreValidate.id) throw new Error("Já existe um gênero com esse nome");

      //6. insert the genre
      const insertId: number = await GenreModel.create(genre);

      //7. validate insertion
      if (insertId !== 0) {
        genre.id = insertId;
        response = { data: genre.toJson(), status: { error: false, message: "Gênero cadastrado" } };
      } else throw new Error("Erro ao inserir gênero");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar gênero" },
      };
    }

    res.json(response);
  }

  /**
   * Update a genre
   * id: id of the genre - 1 IN URL
   * description: description of the genre - Revista
   */
  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id in the url
      const id: number = parseInt(req.params.id);

      //2. get and create a genre with the given data
      const genre: Genre = new Genre(req.body.description, id);

      //3. validate if a genre with the given id exists
      const existingGenre: Genre = await GenreModel.findById(id);
      if (0 === existingGenre.id) throw new Error("Gênero não encontrado");

      //4. validate genre data
      const resValidate: ResponseData = genre.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let genreValidate: Genre;
      //5. validate name of the genre
      genreValidate = await GenreModel.findByDescription(genre.description, genre.id);
      if (0 !== genreValidate.id) throw new Error("Já existe um gênero com esse nome");

      //8. update genre
      const updatedGenre: boolean = await GenreModel.update(genre);

      //9. validate the update
      if (true === updatedGenre)
        response = {
          data: genre.toJson(),
          status: { error: false, message: "Gênero atualizado" },
        };
      else throw new Error("Erro ao atualizar gênero");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro alterar gênero" },
      };
    }

    res.json(response);
  }

  /**
   * delete a genre
   * id: id of the genre
   */
  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id
      const id: number = parseInt(req.params.id, 10);
      //2. validate if exists a genre with the given id
      let genre: Genre = await GenreModel.findById(id);
      if (genre.id === 0) throw new Error("Gênero não encontrado");

      //3. delete genre
      let result: boolean = await GenreModel.delete(genre);

      //4. validate deletion
      if (true === result)
        response = { data: {}, status: { error: false, message: "Gênero removido" } };
      else throw new Error("Erro ao deletar gênero");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao excluir gênero" },
      };
    }

    res.json(response);
  }
}
