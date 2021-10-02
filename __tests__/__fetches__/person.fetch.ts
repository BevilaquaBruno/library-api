import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";

dotenv.config();

export default class PersonFetch {
  public static async findAll(): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/person",
      responseType: "json",
    });
  }
}
