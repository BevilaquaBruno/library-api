import { Request, Response } from "express";
import UserModel from "../models/User.model";
import User from "../classes/User.class";
import { ResponseData } from "../interfaces/Common.interface";

export default class UserController {
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const users: User[] = await UserModel.findAll();
      response = {
        data: users.map((u) => u.toJson()),
        status: { error: false, message: "Lista de todos os usuários" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados dos usuários",
        },
      };
    }

    res.json(response);
  }

  public static async find(req: Request, res: Response) {
    let response: ResponseData;
    const id: number = parseInt(req.params.id, 10);

    try {
      let user: User = await UserModel.findById(id);
      if (0 == user.id) throw new Error("Usuário não encontrado");
      response = { data: user.toJson(), status: { error: false, message: "Usuário encontrado" } };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados do usuário",
        },
      };
    }

    res.json(response);
  }

  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const id: number = parseInt(req.params.id, 10);
      let user: User = await UserModel.findById(id);
      if (!(user.id > 0)) throw new Error("Usuário não encontrado");

      let result = await UserModel.delete(user);
      if (true === result)
        response = { data: {}, status: { error: false, message: "Usuário removido" } };
      else throw new Error("Erro ao deletar usuário");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao excluir usuário" },
      };
    }

    res.json(response);
  }
}
