import { Request, Response } from "express";
import StyleModel from "../models/Style.model";
import Style from "../classes/Style.class";
import { ResponseData } from "../interfaces/Common.interface";

/**
 * ******** IMPORTANT: Style "means" Tipo in portuguese in this case
 * StyleController class is used for /api/style route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class StyleController {
  /**
   * List all styles
   */
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get style in database
      const style: Style[] = await StyleModel.findAll();

      /**
       * 2. map then to get the @toJson data
       */
      response = {
        data: style.map((ct) => ct.toJson()),
        status: { error: false, message: "Lista de todos os tipos" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados dos tipos",
        },
      };
    }

    res.json(response);
  }

  /**
   * List the style with the given id
   * id: style's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the id from url
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. find(or not) the id with the parsed id
      const style: Style = await StyleModel.findById(id);
      //3. validate if the style exists or not in the database
      if (0 === style.id) throw new Error("País não encontrado");
      /**
       * 4. get the @toJson data
       */
      response = { data: style.toJson(), status: { error: false, message: "Tipo encontrado" } };
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao buscar dados do tipo" },
      };
    }

    res.json(response);
  }

  /**
   * Create a style
   * description: description of the style
   */
  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and create a style with the given data
      const style: Style = new Style(req.body.description);

      //2. validate style data
      const resValidate: ResponseData = style.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let styleValidate: Style;
      //3. validate name of the style
      styleValidate = await StyleModel.findByDescription(style.description);
      if (0 !== styleValidate.id) throw new Error("Já existe um tipo com esse nome");

      //6. insert the style
      const insertId: number = await StyleModel.create(style);

      //7. validate insertion
      if (insertId !== 0) {
        style.id = insertId;
        response = { data: style.toJson(), status: { error: false, message: "Tipo cadastrado" } };
      } else throw new Error("Erro ao inserir tipo");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar tipo" },
      };
    }

    res.json(response);
  }

  /**
   * Update a style
   * id: id of the style - 1 IN URL
   * description: description of the style - Revista
   */
  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id in the url
      const id: number = parseInt(req.params.id);

      //2. get and create a style with the given data
      const style: Style = new Style(req.body.description, id);

      //3. validate if a style with the given id exists
      const existingStyle: Style = await StyleModel.findById(id);
      if (0 === existingStyle.id) throw new Error("Tipo não encontrado");

      //4. validate style data
      const resValidate: ResponseData = style.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let styleValidate: Style;
      //5. validate name of the style
      styleValidate = await StyleModel.findByDescription(style.description, style.id);
      if (0 !== styleValidate.id) throw new Error("Já existe um tipo com esse nome");

      //8. update style
      const updatedStyle: boolean = await StyleModel.update(style);

      //9. validate the update
      if (true === updatedStyle)
        response = {
          data: style.toJson(),
          status: { error: false, message: "Tipo atualizado" },
        };
      else throw new Error("Erro ao atualizar tipo");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro alterar tipo" },
      };
    }

    res.json(response);
  }

  /**
   * delete a style
   * id: id of the style
   */
  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id
      const id: number = parseInt(req.params.id, 10);
      //2. validate if exists a style with the given id
      let style: Style = await StyleModel.findById(id);
      if (style.id === 0) throw new Error("Tipo não encontrado");

      //3. delete style
      let result: boolean = await StyleModel.delete(style);

      //4. validate deletion
      if (true === result)
        response = { data: {}, status: { error: false, message: "Tipo removido" } };
      else throw new Error("Erro ao deletar tipo");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao excluir tipo" },
      };
    }

    res.json(response);
  }
}
