import { Request, Response, NextFunction } from "express";
import { RequestWithUser, ResponseData } from "../interfaces/Common.interface";
import jwt from "jsonwebtoken";
import User from "../classes/User.class";
import { UserData } from "../interfaces/User.interface";

/**
 * Function user to verify is jwt is in the header and if it's valid
 * @param req @Request from ExpressJs - https://expressjs.com/en/4x/api.html#req
 * @param res @Response from ExpressJs - https://expressjs.com/en/4x/api.html#res
 * @param next @NextFuncion from ExpressJs - https://expressjs.com/en/api.html#router.param
 */
export const verifyJwt = (req: Request, res: Response, next: NextFunction): void  => {
  //1. get token from header
  const token: string | any = req.headers["x-access-token"];

  try {
    //2. valid if token exists
    if (!token && "string" != typeof token) throw new Error("Token não foi informado.");

    //3. get secret from env
    const secret: string | undefined = process.env.SECRET;
    //4. validate secret
    if ("string" === typeof secret) {
      //5. verify is secret is valid with jsonwebtoken.verify - https://www.npmjs.com/package/jsonwebtoken
      jwt.verify(token, secret, (err: any, decoded: any) => {
        if (err) throw new Error("Usuário não autenticado.");
        /**
         * 6. cast decoded as @UserData interface
         */
        let userData: UserData = decoded as UserData;
        let user: User = new User(userData.name, userData.username, userData.email, userData.id);
        /**
         * 7. cas req as @RequestWithUser to put user together
         */
        (req as RequestWithUser).user = user;
        //8. call next method
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
