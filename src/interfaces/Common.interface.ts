import { Request } from "express";

/**
 * Interfaces for general use
 */

/**
 * @ResponseData
 * Interface for response patter of ANY request
 */
export interface ResponseData {
  data: any;
  status: {
    error: boolean;
    message: string;
  };
}

/**
 * @RequestWithUser
 * Extends @Request from ExpresJs https://expressjs.com/en/4x/api.html#req
 * with the logged user
 */
export interface RequestWithUser extends Request {
  user: {
    id: number;
    name: string;
    username: string;
    email: string;
  };
}
