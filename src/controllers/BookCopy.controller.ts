import { Request, Response } from "express";
import BookCopy from "../classes/BookCopy.class";
import { ResponseData } from "../interfaces/Common.interface";
import BookCopyModel from "../models/BookCopy.model";

/**
 * BookCopyController class is used for /api/bookcopy route.
 * Methods below uses this both parameters
 * @param req @Request - from ExpresJs https://expressjs.com/en/4x/api.html#req
 * @param res @Response - from ExpressJs https://expressjs.com/en/4x/api.html#res
 */
export default class BookCopyController {
  /**
   * List the bookcopy with the given id
   * id: bookcopy's id - 1 IN THE URL
   */
  public static async findById(req: Request, res: Response) {
    let response: ResponseData;

    //1. get and parse the id from url
    const id: number = parseInt(req.params.id, 10);

    try {
      //2. find(or not) the id with the parsed id
      const bookCopy: BookCopy = await BookCopyModel.findById(id);
      //3. validate if the book exists or not in the database
      if (0 === bookCopy.id) throw new Error("edição do livro não encontrado");
      /**
       * 4. get the @toJson data
       */
      response = {
        data: bookCopy.toJson(),
        status: { error: false, message: "Edição do livro encontrado" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados do edição do livro",
        },
      };
    }

    res.json(response);
  }

  /**
   * List all book copies
   */
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get book copies in database
      const bookCopies: BookCopy[] = await BookCopyModel.findAll();

      /**
       * 2. map then to get the @toJson data
       */
      response = {
        data: bookCopies.map((ct) => ct.toJson()),
        status: { error: false, message: "Lista de todos as edições de livros" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados das edições livros",
        },
      };
    }

    res.json(response);
  }

  /**
   * delete a book copy
   * id: id of the book copy
   */
  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id
      const id: number = parseInt(req.params.id, 10);
      //2. validate if exists a book with the given id
      let bookCopy: BookCopy = await BookCopyModel.findById(id);
      if (bookCopy.id === 0) throw new Error("Edição do livro não encontrada");

      //3. delete bookCopy
      let result: boolean = await BookCopyModel.delete(bookCopy);

      //4. validate deletion
      if (true === result)
        response = { data: {}, status: { error: false, message: "Edição do livro removida" } };
      else throw new Error("Erro ao deletar edição do livro");
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao excluir edição do livro",
        },
      };
    }

    res.json(response);
  }
}
