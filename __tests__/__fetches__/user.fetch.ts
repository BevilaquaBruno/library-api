import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import User from "../../src/classes/User.class";
import { PasswordList } from "../../src/interfaces/User.interface";

dotenv.config();

/**
 * Fetches for user routes using axios - https://www.npmjs.com/package/axios
 */

export default class UserFetch {
  public static async create(
    token: string,
    user: User,
    passwordList: PasswordList
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
        password: passwordList.password,
        passwordConfirm: passwordList.passwordConfirm,
      },
    });
  }

  public static async update(token: string, user: User): Promise<AxiosResponse> {
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/user/" + user.id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  }

  public static async updatePassword(
    token: string,
    id: number,
    passwordList: PasswordList
  ): Promise<AxiosResponse> {
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/user/" + id + "/password",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: passwordList,
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
