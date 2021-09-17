import { Request, Response } from "express";
import UserModel from "../models/User.model";
import User from "../classes/User.class";
import { RequestWithUser, ResponseData } from "../interfaces/Common.interface";
import md5 from "md5";

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

  public static async findById(req: Request, res: Response) {
    let response: ResponseData;
    const id: number = parseInt(req.params.id, 10);

    try {
      let user: User = await UserModel.findById(id);
      if (0 === user.id) throw new Error("Usuário não encontrado");
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

  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const user: User = new User(req.body.name, req.body.username, req.body.email);

      if ("" === (req.body?.password ?? "")) throw new Error("Informe a senha");
      if ("" === (req.body?.passwordConfirm ?? ""))
        throw new Error("Repita a senha na confirmação da senha");
      if (md5(req.body.password) !== md5(req.body.passwordConfirm))
        throw new Error("As senhas não coincidem");

      user.password = md5(req.body.password);

      const resValidate: ResponseData = user.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let userValidate: User;
      userValidate = await UserModel.findByUsername(user.username);
      if (0 !== userValidate.id) throw new Error("Já existe um usuário com esse username");
      userValidate = await UserModel.findByEmail(user.email);
      if (0 !== userValidate.id) throw new Error("Já existe um usuário com esse email");

      const insertId = await UserModel.create(user);
      if (insertId !== 0) {
        user.id = insertId;
        response = { data: user.toJson(), status: { error: false, message: "Usuário cadastrado" } };
      } else throw new Error("Erro ao inserir usuário");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar usuário" },
      };
    }

    res.json(response);
  }

  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const id: number = parseInt(req.params.id, 10);
      let user: User = await UserModel.findById(id);
      if (user.id === 0) throw new Error("Usuário não encontrado");
      if (user.id === (req as RequestWithUser)?.user.id)
        throw new Error("Usuário não pode excluir o próprio cadastro");

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
