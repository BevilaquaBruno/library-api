import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import User from "../../src/classes/User.class";

dotenv.config();

export default class UserFetch {
  public static async create(
    token: string,
    user: User,
    password: string,
    passwordConfirm: string
  ): Promise<AxiosResponse> {
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/user",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
        password: password,
        passwordConfirm: passwordConfirm,
      },
    });
  }

  public static async delete(token: string, id: number) {
    return await axios({
      method: "DELETE",
      url: "http://localhost:" + process.env.PORT + "/api/user/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async findAll(token: string): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/user",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async findById(token: string, id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/user/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }
}
