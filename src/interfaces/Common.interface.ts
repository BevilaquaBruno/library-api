import {Request} from 'express';

export interface ResponseData {
  data: any,
  status: {
    error: boolean,
    message: string
  }
}

export interface RequestWithUser extends Request
{
    user: {
      id: number,
      name: string,
      username: string,
      email: string
    };
}