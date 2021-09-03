import { Request, Response, NextFunction } from "express";

export const notFoundHandler = (
  request: Request,
  response: Response,
  next: NextFunction
) => {

  const message = "Resource not found";
  const error = true;
  response.status(404).json({ status: { error: error, message: message } });
};