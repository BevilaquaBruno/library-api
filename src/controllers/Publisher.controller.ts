import { Request, Response } from "express";
import PublisherModel from "../models/Publisher.model";
import Publisher from "../classes/Publisher.class";
import { ResponseData } from "../interfaces/Common.interface";
import Country from "../classes/Country.class";
import CountryModel from "../models/Country.model";

/**
 * PublisherController class is used for /api/publisher route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class PublisherController {
  /**
   * List all publishers
   */
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get publisher in database
      const publisher: Publisher[] = await PublisherModel.findAll();

      /**
       * 2. map then to get the @toJson data
       */
      response = {
        data: publisher.map((ct) => ct.toJson()),
        status: { error: false, message: "Lista de todos as editoras" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados das editoras",
        },
      };
    }

    res.json(response);
  }

  /**
   * List the publisher with the given id
   * id: publisher's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the id from url
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. find(or not) the id with the parsed id
      const publisher: Publisher = await PublisherModel.findById(id);
      //3. validate if the publisher exists or not in the database
      if (0 === publisher.id) throw new Error("Editora não encontrada");
      /**
       * 4. get the @toJson data
       */
      response = {
        data: publisher.toJson(),
        status: { error: false, message: "Editora encontrada" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados da editora",
        },
      };
    }

    res.json(response);
  }

  /**
   * Create a publisher
   * name: name of the publisher
   * country_id country of the publisher
   */
  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and create a publisher with the given data
      const country: Country = await CountryModel.findById(req.body.country_id);
      if(0 === country.id) throw new Error("País é obrigatório");

      const publisher: Publisher = new Publisher(req.body.name, country);

      //2. validate publisher data
      const resValidate: ResponseData = publisher.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let publisherValidate: Publisher;
      //3. validate name of the publisher
      publisherValidate = await PublisherModel.findByName(publisher.name);
      if (0 !== publisherValidate.id) throw new Error("Já existe uma editora com esse nome");

      //6. insert the publisher
      const insertId: number = await PublisherModel.create(publisher);

      //7. validate insertion
      if (insertId !== 0) {
        publisher.id = insertId;
        response = {
          data: publisher.toJson(),
          status: { error: false, message: "Editora cadastrada" },
        };
      } else throw new Error("Erro ao inserir editora");
    } catch (e: any) {
      console.log(e);
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar editora" },
      };
    }

    res.json(response);
  }

  /**
   * Update a publisher
   * id: id of the publisher - 1 IN URL
   * name: name of the publisher - Companhia das letras
   */
  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id in the url
      const id: number = parseInt(req.params.id);

      //2. get and create a publisher with the given data
      const country: Country = await CountryModel.findById(req.body.country_id);
      if(0 === country.id) throw new Error("País é obrigatório");

      const publisher: Publisher = new Publisher(req.body.name, country, id);

      //3. validate if a publisher with the given id exists
      const existingPublisher: Publisher = await PublisherModel.findById(id);
      if (0 === existingPublisher.id) throw new Error("Editora não encontrada");

      //4. validate publisher data
      const resValidate: ResponseData = publisher.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let publisherValidate: Publisher;
      //5. validate name of the publisher
      publisherValidate = await PublisherModel.findByName(publisher.name, publisher.id);
      if (0 !== publisherValidate.id) throw new Error("Já existe uma editora com esse nome");

      //8. update publisher
      const updatedPublisher: boolean = await PublisherModel.update(publisher);

      //9. validate the update
      if (true === updatedPublisher)
        response = {
          data: publisher.toJson(),
          status: { error: false, message: "Editora atualizada" },
        };
      else throw new Error("Erro ao atualizar editora");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro alterar editora" },
      };
    }

    res.json(response);
  }

  /**
   * delete a publisher
   * id: id of the publisher
   */
  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id
      const id: number = parseInt(req.params.id, 10);
      //2. validate if exists a publisher with the given id
      let publisher: Publisher = await PublisherModel.findById(id);
      if (publisher.id === 0) throw new Error("Editora não encontrada");

      //3. delete publisher
      let result: boolean = await PublisherModel.delete(publisher);

      //4. validate deletion
      if (true === result)
        response = { data: {}, status: { error: false, message: "Editora removida" } };
      else throw new Error("Erro ao deletar editora");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao excluir editora" },
      };
    }

    res.json(response);
  }
}
