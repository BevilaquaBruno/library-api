import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";

dotenv.config();

export const findAll = async (token: string): Promise<AxiosResponse> => {
  return await axios({
    method: "GET",
    url: "http://localhost:" + process.env.PORT + "/api/user",
    responseType: "json",
    headers: {
      "x-access-token": token,
    },
  });
};

export const find = async (token: string, id: number): Promise<AxiosResponse> => {
  return await axios({
    method: "GET",
    url: "http://localhost:" + process.env.PORT + "/api/user/" + id,
    responseType: "json",
    headers: {
      "x-access-token": token,
    },
  });
};
