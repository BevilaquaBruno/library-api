import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import Person from "../../src/classes/Person.class";

dotenv.config();

/**
 * Fetches for person routes using axios - https://www.npmjs.com/package/axios
 */

export default class PersonFetch {
  public static async findAll(): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/person",
      responseType: "json",
    });
  }

  public static async findById(id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/person/" + id,
      responseType: "json",
    });
  }

  public static async delete(token: string, id: number): Promise<AxiosResponse> {
    return await axios({
      method: "DELETE",
      url: "http://localhost:" + process.env.PORT + "/api/person/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async update(token: string, person: Person): Promise<AxiosResponse> {
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/person/" + person.id_person,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        name: person.name,
        email: person.email,
        phone: person.phone,
        birth_date: person.birth_date,
        cpf: person.cpf,
        address: person.address,
        city: person.city,
        state: person.state,
      },
    });
  }

  public static async create(token: string, person: Person): Promise<AxiosResponse> {
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/person",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        name: person.name,
        email: person.email,
        phone: person.phone,
        birth_date: person.birth_date,
        cpf: person.cpf,
        address: person.address,
        city: person.city,
        state: person.state,
      },
    });
  }
}
