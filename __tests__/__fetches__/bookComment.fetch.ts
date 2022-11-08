import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import BookComment from "../../src/classes/BookComment.class";

dotenv.config();

/**
 * Fetches for book comment routes using axios - https://www.npmjs.com/package/axios
 */

export default class BookCommentFetch {
  public static async create(token: string, bookComment: BookComment): Promise<AxiosResponse> {
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/bookComment",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        description: bookComment.description,
        vote: bookComment.vote,
        visible: bookComment.visible,
        person_id: bookComment.person?.id_person,
        book_id: bookComment.book.id
      },
    });
  }

  public static async update(token: string, bookComment: BookComment): Promise<AxiosResponse> {
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/bookComment/" + bookComment.id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        description: bookComment.description,
        vote: bookComment.vote,
        visible: bookComment.visible,
        person_id: bookComment.person?.id_person,
        book_id: bookComment.book.id
      },
    });
  }

  public static async delete(token: string, id: number): Promise<AxiosResponse> {
    return await axios({
      method: "DELETE",
      url: "http://localhost:" + process.env.PORT + "/api/bookComment/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async findAll(book_id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/bookComment/book/" + book_id,
      responseType: "json",
    });
  }

  public static async findById(id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/bookComment/" + id,
      responseType: "json",
    });
  }
}
