import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import Idiom from "../../src/classes/Idiom.class";

dotenv.config();

/**
 * Fetches for idiom routes using axios - https://www.npmjs.com/package/axios
 */

export default class IdiomFetch {
  public static async create(token: string, idiom: Idiom): Promise<AxiosResponse> {
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/idiom",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        description: idiom.description,
      },
    });
  }

  public static async update(token: string, idiom: Idiom): Promise<AxiosResponse> {
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/idiom/" + idiom.id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        description: idiom.description,
      },
    });
  }

  public static async delete(token: string, id: number): Promise<AxiosResponse> {
    return await axios({
      method: "DELETE",
      url: "http://localhost:" + process.env.PORT + "/api/idiom/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async findAll(): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/idiom",
      responseType: "json",
    });
  }

  public static async findById(id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/idiom/" + id,
      responseType: "json",
    });
  }
}
