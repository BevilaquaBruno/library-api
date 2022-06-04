import { Request, Response } from "express";
import Book from "../classes/Book.class";
import BookComment from "../classes/BookComment.class";
import { ResponseData } from "../interfaces/Common.interface";
import BookModel from "../models/Book.model";
import BookCommentModel from "../models/BookComment.model";
import PersonModel from "../models/Person.model";

/**
 * BookCommentController class is used for /api/bookcopy route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class BookCommentController {
  /**
   * List the bookcomment with the given id
   * id: bookcomment's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the id from url
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. find(or not) the id with the parsed id
      const bookComment: BookComment = await BookCommentModel.findById(id);
      //3. validate if the book exists or not in the database
      if (0 === bookComment.id) throw new Error("Comentário do livro não encontrado");
      /**
       * 4. get the @toJson data
       */
      response = {
        data: bookComment.toJson(),
        status: { error: false, message: "Comentário do livro encontrado" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados do comentário do livro",
        },
      };
    }

    res.json(response);
  }

  /**
   * List all book copies
   */
  public static async findAllFromBook(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the id from url
    const id: number = parseInt(req.params.id, 10);

    try {
      //1. get book copies in database
      const bookCopies: BookComment[] = await BookCommentModel.findAllFromBook(id);

      /**
       * 2. map then to get the @toJson data
       */
      response = {
        data: {
          book: (bookCopies[0] != null ? bookCopies[0].book.toJson() : null),
          comments: bookCopies.map((ct) => ct.toJsonNoBook())
        },
        status: { error: false, message: "Lista de todos os comentários do livro" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados dos comentários do livro",
        },
      };
    }

    res.json(response);
  }
}
