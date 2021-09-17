import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";

dotenv.config();

export default class AuthFetch {
  public static async logout(): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/auth/logout",
      responseType: "json",
    });
  }

  public static async login(): Promise<AxiosResponse> {
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/auth/login",
      responseType: "json",
      data: {
        username: "bevilaqua",
        password: "123",
      },
    });
  }
}
