import { Request, Response } from "express";
import User from "../classes/User.class";
import { ResponseData } from "../interfaces/Common.interface";
import { UserAuth } from "../interfaces/User.interface";
import UserModel from "../models/User.model";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import md5 from "md5";

// Here is used the secret, for login validation purposes
dotenv.config();

/**
 * AuthController class is used for /api/auth route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class AuthController {
  /**
   * Login method, called from POST /api/auth/login.
   * username: username to login
   * password: password to login
   */
  public static async login(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. Get user data from post
      let authData: UserAuth = {
        username: req.body?.username ?? "",
        password: req.body?.password ?? "",
      };

      //2. validate data retrieved
      if ("" === authData.username) throw new Error("Informe o usuário");
      if ("" === authData.password) throw new Error("Informe a senha");

      let user: User = await UserModel.findByUsername(authData.username);
      if (0 === user.id) throw new Error("Usuário não encontrado");

      //3. validate if password match with user password
      if (md5(authData.password) !== user.password) throw new Error("Usuário ou senha incorreto");

      //4. validate secret in file
      const secret: string | undefined = process.env.SECRET;
      if ("string" === typeof secret) {
        //5. generate token with jsonwebtoken - https://www.npmjs.com/package/jsonwebtoken
        const token: string = jwt.sign(user.toJson(), secret, { expiresIn: 5000 });
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

  /**
   * Logout method, calle from GET /api/auth/login
   */
  public static async logout(req: Request, res: Response) {
    //1. this method just return the token equal to null
    let response: ResponseData = {
      data: { token: null },
      status: { error: false, message: "Logout efetuado com sucesso" },
    };
    res.json(response);
  }
}
