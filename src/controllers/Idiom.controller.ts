import { Request, Response } from "express";
import IdiomModel from "../models/Idiom.model";
import Idiom from "../classes/Idiom.class";
import { ResponseData } from "../interfaces/Common.interface";

/**
 * IdiomController class is used for /api/idiom route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class IdiomController {
  /**
   * List all idioms
   */
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get idiom in database
      const idiom: Idiom[] = await IdiomModel.findAll();

      /**
       * 2. map then to get the @toJson data
       */
      response = {
        data: idiom.map((ct) => ct.toJson()),
        status: { error: false, message: "Lista de todos os idiomas" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados dos idiomas",
        },
      };
    }

    res.json(response);
  }

  /**
   * List the idiom with the given id
   * id: idiom's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the id from url
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. find(or not) the id with the parsed id
      const idiom: Idiom = await IdiomModel.findById(id);
      //3. validate if the idiom exists or not in the database
      if (0 === idiom.id) throw new Error("Idioma não encontrado");
      /**
       * 4. get the @toJson data
       */
      response = { data: idiom.toJson(), status: { error: false, message: "Idioma encontrado" } };
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao buscar dados do idioma" },
      };
    }

    res.json(response);
  }

  /**
   * Create a idiom
   * description: description of the idiom
   */
  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and create a idiom with the given data
      const idiom: Idiom = new Idiom(req.body.description);

      //2. validate idiom data
      const resValidate: ResponseData = idiom.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let idiomValidate: Idiom;
      //3. validate name of the idiom
      idiomValidate = await IdiomModel.findByDescription(idiom.description);
      if (0 !== idiomValidate.id) throw new Error("Já existe um idioma com esse nome");

      //6. insert the idiom
      const insertId: number = await IdiomModel.create(idiom);

      //7. validate insertion
      if (insertId !== 0) {
        idiom.id = insertId;
        response = { data: idiom.toJson(), status: { error: false, message: "Idioma cadastrado" } };
      } else throw new Error("Erro ao inserir idioma");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar idioma" },
      };
    }

    res.json(response);
  }

  /**
   * Update a idiom
   * id: id of the idiom - 1 IN URL
   * description: description of the idiom - Revista
   */
  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id in the url
      const id: number = parseInt(req.params.id);

      //2. get and create a idiom with the given data
      const idiom: Idiom = new Idiom(req.body.description, id);

      //3. validate if a idiom with the given id exists
      const existingIdiom: Idiom = await IdiomModel.findById(id);
      if (0 === existingIdiom.id) throw new Error("Idioma não encontrado");

      //4. validate idiom data
      const resValidate: ResponseData = idiom.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let idiomValidate: Idiom;
      //5. validate name of the idiom
      idiomValidate = await IdiomModel.findByDescription(idiom.description, idiom.id);
      if (0 !== idiomValidate.id) throw new Error("Já existe um idioma com esse nome");

      //8. update idiom
      const updatedIdiom: boolean = await IdiomModel.update(idiom);

      //9. validate the update
      if (true === updatedIdiom)
        response = {
          data: idiom.toJson(),
          status: { error: false, message: "Idioma atualizado" },
        };
      else throw new Error("Erro ao atualizar idioma");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro alterar idioma" },
      };
    }

    res.json(response);
  }

  /**
   * delete a idiom
   * id: id of the idiom
   */
  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id
      const id: number = parseInt(req.params.id, 10);
      //2. validate if exists a idiom with the given id
      let idiom: Idiom = await IdiomModel.findById(id);
      if (idiom.id === 0) throw new Error("Idioma não encontrado");

      //3. delete idiom
      let result: boolean = await IdiomModel.delete(idiom);

      //4. validate deletion
      if (true === result)
        response = { data: {}, status: { error: false, message: "Idioma removido" } };
      else throw new Error("Erro ao deletar idioma");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao excluir idioma" },
      };
    }

    res.json(response);
  }
}
