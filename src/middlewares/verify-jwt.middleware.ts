import { Request, Response,NextFunction } from "express";
import { RequestWithUser, ResponseData } from "../interfaces/Common.interface";
import jwt from "jsonwebtoken";

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const token: string | any = req.headers['x-access-token'];

  try {
    if (!token && 'string' != typeof token)
      throw new Error("Token não foi informado.");

    const secret: string | undefined = process.env.SECRET;
    if ('string' === typeof secret) {
      jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err)
          throw new Error("Usuário não autenticado.");
        (req as RequestWithUser).user = decoded;
        next();
      });
    }else
      throw new Error("Erro ao validar token de acesso.");
  } catch (e) {
    let response: ResponseData = { data: {}, status: {error: true, message: (e as Error).message } };
    res.json(response);
  }
}