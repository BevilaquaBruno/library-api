import { Request, Response } from "express";
import PersonModel from "../models/Person.model";
import Person from "../classes/Person.class";
import { ResponseData } from "../interfaces/Common.interface";

export default class PersonController {
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const people: Person[] = await PersonModel.findAll();
      response = {
        data: people.map((ct) => ct.toJson()),
        status: { error: false, message: "Lista de todas as pessoas" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados das pessoas",
        },
      };
    }

    res.json(response);
  }
}