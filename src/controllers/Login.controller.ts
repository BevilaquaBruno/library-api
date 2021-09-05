import { Request, Response } from 'express';
import User from '../classes/User.class';
import { ResponseData } from '../interfaces/Common.interface';
import { UserLogin } from '../interfaces/User.interface';
import UserModel from '../models/User.model';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import md5 from 'md5';

dotenv.config();

export default class LoginController {
  public static async login(req: Request, res: Response){
    let response: ResponseData;

    try {
      let loginData: UserLogin = { username: req.body.username, password: req.body.password };

      if ("" == loginData.username || undefined === loginData.username)
        throw new Error("Informe o usuário");
      if ("" == loginData.password || undefined === loginData.password)
        throw new Error("Informe a senha");

      let user: User = await UserModel.findByUsername(loginData.username);
      if (0 === user.id)
        throw new Error("Usuário não encontrado");
      if (md5(loginData.password) != user.password)
        throw new Error("Usuário ou senha incorreto");

      const secret: string | undefined = process.env.SECRET;
      if ('string' === typeof secret) {
        const token = jwt.sign(user.toJson(), secret, { expiresIn: 5000 });
        response = { data: { token: token }, status: { error: false, message: "Usuário logado com sucesso" }};
      }else
        throw new Error("Erro ao gerar token de acesso");
    } catch (e) {
      response = { data:{}, status: { error: true, message: (e as Error).message } };
    }

    res.json(response);
  }

  public static async logout(req: Request, res: Response) {
    let response: ResponseData = { data: { token: null }, status: { error: false, message: "Logout efetuado com sucesso" }};
    res.json(response);
  }
}