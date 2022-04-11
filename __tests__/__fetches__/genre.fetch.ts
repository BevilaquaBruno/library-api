import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import Genre from "../../src/classes/Genre.class";

dotenv.config();

/**
 * Fetches for genre routes using axios - https://www.npmjs.com/package/axios
 */

export default class GenreFetch {
  public static async create(token: string, genre: Genre): Promise<AxiosResponse> {
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/genre",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        description: genre.description,
      },
    });
  }

  public static async update(token: string, genre: Genre): Promise<AxiosResponse> {
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/genre/" + genre.id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        description: genre.description,
      },
    });
  }

  public static async delete(token: string, id: number): Promise<AxiosResponse> {
    return await axios({
      method: "DELETE",
      url: "http://localhost:" + process.env.PORT + "/api/genre/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async findAll(): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/genre",
      responseType: "json",
    });
  }

  public static async findById(id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/genre/" + id,
      responseType: "json",
    });
  }
}
