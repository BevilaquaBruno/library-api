import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import Style from "../../src/classes/Style.class";

dotenv.config();

/**
 * Fetches for style routes using axios - https://www.npmjs.com/package/axios
 */

export default class StyleFetch {
  public static async create(token: string, style: Style): Promise<AxiosResponse> {
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/style",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        description: style.description,
      },
    });
  }

  public static async update(token: string, style: Style): Promise<AxiosResponse> {
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/style/" + style.id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        description: style.description,
      },
    });
  }

  public static async delete(token: string, id: number): Promise<AxiosResponse> {
    return await axios({
      method: "DELETE",
      url: "http://localhost:" + process.env.PORT + "/api/style/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async findAll(): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/style",
      responseType: "json",
    });
  }

  public static async findById(id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/style/" + id,
      responseType: "json",
    });
  }
}
