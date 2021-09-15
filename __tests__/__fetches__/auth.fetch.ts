import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";

dotenv.config();

export const logout = async (): Promise<AxiosResponse> => {
  return await axios({
    method: "GET",
    url: "http://localhost:" + process.env.PORT + "/api/auth/logout",
    responseType: "json",
  });
};

export const login = async () => {
  return await axios({
    method: "POST",
    url: "http://localhost:" + process.env.PORT + "/api/auth/login",
    responseType: "json",
    data: {
      username: "bevilaqua",
      password: "123",
    },
  });
};
