import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import Book from "../../src/classes/Book.class";
import Author from "../../src/classes/Author.class";

dotenv.config();

/**
 * Fetches for book routes using axios - https://www.npmjs.com/package/axios
 */

export default class BookFetch {
  public static async create(token: string, book: Book): Promise<AxiosResponse> {
    let author_list: number[] = [];
    if(null !== book.authors){
      book.authors.forEach((author: Author) => {
        author_list.push(author.id);
      });
    }
    return await axios({
      method: "POST",
      url: "http://localhost:" + process.env.PORT + "/api/book",
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        name: book.name,
        volumn: book.volumn,
        number_pages: book.number_pages,
        edition: book.edition,
        release_year: book.release_year,
        author_obs: book.author_obs,
        obs: book.obs,
        isbn: book.isbn,
        publisher_id: book.publisher?.id,
        style_id: book.style?.id,
        genre_id: book.genre?.id,
        idiom_id: book.idiom?.id,
        authors: [] === author_list ? null : author_list
      },
    });
  }

  public static async update(token: string, book: Book): Promise<AxiosResponse> {
    let author_list: number[] = [];
    if(null !== book.authors){
      book.authors.forEach((author: Author) => {
        author_list.push(author.id);
      });
    }
    return await axios({
      method: "PUT",
      url: "http://localhost:" + process.env.PORT + "/api/book/" + book.id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
      data: {
        name: book.name,
        volumn: book.volumn,
        number_pages: book.number_pages,
        edition: book.edition,
        release_year: book.release_year,
        author_obs: book.author_obs,
        obs: book.obs,
        isbn: book.isbn,
        publisher_id: book.publisher?.id,
        style_id: book.style?.id,
        genre_id: book.genre?.id,
        idiom_id: book.idiom?.id,
        authors: [] === author_list ? null : author_list
      },
    });
  }

  public static async delete(token: string, id: number): Promise<AxiosResponse> {
    return await axios({
      method: "DELETE",
      url: "http://localhost:" + process.env.PORT + "/api/book/" + id,
      responseType: "json",
      headers: {
        "x-access-token": token,
      },
    });
  }

  public static async findAll(): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/book",
      responseType: "json",
    });
  }

  public static async findById(id: number): Promise<AxiosResponse> {
    return await axios({
      method: "GET",
      url: "http://localhost:" + process.env.PORT + "/api/book/" + id,
      responseType: "json",
    });
  }
}
