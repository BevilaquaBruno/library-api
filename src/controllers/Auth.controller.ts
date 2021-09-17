import { Request, Response } from "express";
import User from "../classes/User.class";
import { ResponseData } from "../interfaces/Common.interface";
import { UserAuth } from "../interfaces/User.interface";
import UserModel from "../models/User.model";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import md5 from "md5";

dotenv.config();

export default class AuthController {
  public static async login(req: Request, res: Response) {
    let response: ResponseData;

    try {
      let authData: UserAuth = {
        username: req.body?.username ?? "",
        password: req.body?.password ?? "",
      };

      if ("" === authData.username) throw new Error("Informe o usuário");
      if ("" === authData.password) throw new Error("Informe a senha");

      let user: User = await UserModel.findByUsername(authData.username);
      if (0 === user.id) throw new Error("Usuário não encontrado");
      if (md5(authData.password) !== user.password) throw new Error("Usuário ou senha incorreto");

      const secret: string | undefined = process.env.SECRET;
      if ("string" === typeof secret) {
        const token = jwt.sign(user.toJson(), secret, { expiresIn: 5000 });
        response = {
          data: { token: token },
          status: { error: false, message: "Usuário logado com sucesso" },
        };
      } else throw new Error("Erro ao gerar token de acesso");
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao autenticar usuário",
        },
      };
    }

    res.json(response);
  }

  public static async logout(req: Request, res: Response) {
    let response: ResponseData = {
      data: { token: null },
      status: { error: false, message: "Logout efetuado com sucesso" },
    };
    res.json(response);
  }
}
