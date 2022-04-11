import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import Publisher from "../../src/classes/Publisher.class";

dotenv.config();

/**
 * Fetches for publisher routes using axios - https://www.npmjs.com/package/axios
 */

export default class PublisherFetch {
  public static async create(token: string, publisher: Publisher): Promise<AxiosResponse> {
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/publisher",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        name: publisher.name,
        country_id: publisher.country.id,
      },
    });
  }

  public static async update(token: string, publisher: Publisher): Promise<AxiosResponse> {
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/publisher/" + publisher.id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        name: publisher.name,
        country_id: publisher.country.id,
      },
    });
  }

  public static async delete(token: string, id: number): Promise<AxiosResponse> {
    return await axios({
      method: "DELETE",
      url: "http://localhost:" + process.env.PORT + "/api/publisher/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async findAll(): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/publisher",
      responseType: "json",
    });
  }

  public static async findById(id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/publisher/" + id,
      responseType: "json",
    });
  }
}
