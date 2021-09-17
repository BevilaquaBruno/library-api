import { Request, Response, NextFunction } from "express";
import { RequestWithUser, ResponseData } from "../interfaces/Common.interface";
import jwt from "jsonwebtoken";
import User from "../classes/User.class";
import { UserData } from "../interfaces/User.interface";

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const token: string | any = req.headers["x-access-token"];

  try {
    if (!token && "string" != typeof token) throw new Error("Token não foi informado.");

    const secret: string | undefined = process.env.SECRET;
    if ("string" === typeof secret) {
      jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) throw new Error("Usuário não autenticado.");
        let userData: UserData = decoded as UserData;
        let user: User = new User(userData.name, userData.username, userData.email, userData.id);
        (req as RequestWithUser).user = user;
        next();
      });
    } else throw new Error("Erro ao validar token de acesso.");
  } catch (e: any) {
    let response: ResponseData = {
      data: {},
      status: {
        error: true,
        message: (e as Error)?.message ?? "Erro ao tentar validar token de acesso",
      },
    };
    res.json(response);
  }
};
