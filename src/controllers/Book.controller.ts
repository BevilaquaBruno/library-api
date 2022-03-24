import { Request, Response } from "express";
import BookModel from "../models/Book.model";
import Book from "../classes/Book.class";
import { ResponseData } from "../interfaces/Common.interface";

/**
 * BookController class is used for /api/book route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class BookController {
  /**
   * List the book with the given id
   * id: book's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the id from url
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. find(or not) the id with the parsed id
      const book: Book = await BookModel.findById(id);
      //3. validate if the book exists or not in the database
      if (0 === book.id) throw new Error("Livro não encontrado");
      /**
       * 4. get the @toJson data
       */
      response = { data: book.toJson(), status: { error: false, message: "Livro encontrado" } };
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao buscar dados do Livro" },
      };
    }

    res.json(response);
  }
}
