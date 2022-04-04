import { Request, Response, NextFunction } from "express";
import { ResponseData } from "../interfaces/Common.interface";

/**
 * Handler to resource not found
 * @param req @Request from ExpressJs - https://expressjs.com/en/4x/api.html#req
 * @param res @Response from ExpressJs - https://expressjs.com/en/4x/api.html#res
 * @param next @NextFuncion from ExpressJs - https://expressjs.com/en/api.html#router.param
 * Used to call next function
 */
export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void  => {
  let response: ResponseData = { data: {}, status: { error: true, message: "Resource not found" } };
  res.status(404).json(response);
};
