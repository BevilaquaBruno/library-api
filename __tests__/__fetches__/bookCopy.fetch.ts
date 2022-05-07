import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import BookCopy from "../../src/classes/BookCopy.class";

dotenv.config();

/**
 * Fetches for book routes using axios - https://www.npmjs.com/package/axios
 */

export default class BookCopyFetch {
  public static async create(token: string, bookCopy: BookCopy): Promise<AxiosResponse> {
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/bookCopy",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        description: bookCopy.description,
        buy_or_gift: bookCopy.buy_or_gift,
        buy_or_gift_date: bookCopy.buy_or_gift_date,
        obs: bookCopy.obs,
        receiver_person_id: bookCopy.receiver_person.id_person,
        book_id: bookCopy.book.id,
        photo: bookCopy.photo
      },
    });
  }

  public static async update(token: string, bookCopy: BookCopy): Promise<AxiosResponse> {
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/bookCopy/" + bookCopy.id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        description: bookCopy.description,
        buy_or_gift: bookCopy.buy_or_gift,
        buy_or_gift_date: bookCopy.buy_or_gift_date,
        obs: bookCopy.obs,
        receiver_person_id: bookCopy.receiver_person.id_person,
        book_id: bookCopy.book.id,
        photo: bookCopy.photo
      },
    });
  }

  public static async delete(token: string, id: number): Promise<AxiosResponse> {
    return await axios({
      method: "DELETE",
      url: "http://localhost:" + process.env.PORT + "/api/bookCopy/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async findAll(): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/bookCopy",
      responseType: "json",
    });
  }

  public static async findById(id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/bookCopy/" + id,
      responseType: "json",
    });
  }
}
