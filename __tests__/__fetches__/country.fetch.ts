import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import Country from "../../src/classes/Country.class";

dotenv.config();

/**
 * Fetches for country routes using axios - https://www.npmjs.com/package/axios
 */

export default class CountryFetch {
  public static async create(token: string, country: Country): Promise<AxiosResponse> {
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/country",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        name: country.name,
        fullName: country.fullName,
        short: country.short,
        flag: country.flag,
      },
    });
  }

  public static async update(token: string, country: Country): Promise<AxiosResponse> {
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/country/" + country.id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        name: country.name,
        fullName: country.fullName,
        short: country.short,
        flag: country.flag,
      },
    });
  }

  public static async delete(token: string, id: number): Promise<AxiosResponse> {
    return await axios({
      method: "DELETE",
      url: "http://localhost:" + process.env.PORT + "/api/country/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async findAll(): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/country",
      responseType: "json",
    });
  }

  public static async findById(id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/country/" + id,
      responseType: "json",
    });
  }
}
