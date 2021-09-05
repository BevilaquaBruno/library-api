import { Request, Response, NextFunction } from "express";
import { ResponseData } from "../interfaces/Common.interface";

export const notFoundHandler = ( req: Request, res: Response, next: NextFunction ) => {
  let response: ResponseData = { data: {}, status: { error: true, message: "Resource not found" } };
  res.status(404).json(response);
};