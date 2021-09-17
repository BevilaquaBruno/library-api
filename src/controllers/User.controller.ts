import { Request, Response } from "express";
import UserModel from "../models/User.model";
import User from "../classes/User.class";
import { RequestWithUser, ResponseData } from "../interfaces/Common.interface";
import md5 from "md5";
import { PasswordList } from "../interfaces/User.interface";

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
      const passwordList: PasswordList = {
        password: req.body?.password ?? "",
        passwordConfirm: req.body?.passwordConfirm ?? "",
      }

      if ("" === passwordList.password) throw new Error("Informe a senha");
      if ("" === passwordList.passwordConfirm)
        throw new Error("Repita a senha na confirmação da senha");
      if (md5(passwordList.password) !== md5(passwordList.passwordConfirm))
        throw new Error("As senhas não coincidem");

      user.password = md5(passwordList.password);

      const resValidate: ResponseData = user.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let userValidate: User;
      userValidate = await UserModel.findByUsername(user.username);
      if (0 !== userValidate.id) throw new Error("Já existe um usuário com esse username");
      userValidate = await UserModel.findByEmail(user.email);
      if (0 !== userValidate.id) throw new Error("Já existe um usuário com esse email");

      const insertId: number = await UserModel.create(user);
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

  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const id: number = parseInt(req.params.id);
      const user: User = new User(
        req.body.name,
        req.body.username,
        req.body.email,
        id
      );

      const existingUser: User = await UserModel.findById(user.id);
      if (0 === existingUser.id) throw new Error("Usuário não encontrado");

      const resValidate: ResponseData = user.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let userValidate: User;
      userValidate = await UserModel.findByUsername(user.username, user.id);
      if (0 !== userValidate.id) throw new Error("Já existe um usuário com esse username");
      userValidate = await UserModel.findByEmail(user.email, user.id);
      if (0 !== userValidate.id) throw new Error("Já existe um usuário com esse email");

      const updatedUser: boolean = await UserModel.update(user);
      if (true === updatedUser)
        response = {
          data: user.toJson(),
          status: { error: false, message: "Usuário atualizado" }
        };
      else throw new Error("Erro ao atualizar usuário");
    } catch (e) {
      response = { data: {}, status: { error: true, message: (e as Error)?.message ?? "Erro ao alterar usuário" } };
    }

    res.json(response);
  }

  public static async updatePassword(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const id: number = parseInt(req.params.id);
      const user: User = await UserModel.findById(id);
      if (0 === user.id) throw new Error("Usuário não encontrado");

      const passwordList: PasswordList = {
        password: req.body?.password ?? "",
        passwordConfirm: req.body?.passwordConfirm ?? "",
      }

      if ("" === passwordList.password) throw new Error("Informe a senha");
      if ("" === passwordList.passwordConfirm)
        throw new Error("Repita a senha na confirmação da senha");
      if (md5(passwordList.password) !== md5(passwordList.passwordConfirm))
        throw new Error("As senhas não coincidem");

      user.password = md5(passwordList.password);

      const updatedPassword: boolean = await UserModel.updatePassword(user);
      if (true === updatedPassword)
        response = {
          data: user.toJson(),
          status: { error: false, message: "Senha do usuário atualizada"}
        }
      else throw new Error("Erro ao atualizar a senha do usuário");
    } catch (e) {
      response = { data: {}, status: { error: true, message: (e as Error)?.message ?? "Erro ao alterar senha do usuário" } };
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

      let result: boolean = await UserModel.delete(user);
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
