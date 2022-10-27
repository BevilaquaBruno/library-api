import { Request, Response } from "express";
import Book from "../classes/Book.class";
import BookComment from "../classes/BookComment.class";
import BookCopy from "../classes/BookCopy.class";
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
          book: bookCopies[0] != null ? bookCopies[0].book.toJson() : null,
          comments: bookCopies.map((ct) => ct.toJsonNoBook()),
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

  /**
   * delete a book comment
   * id: id of the book comment
   */
  public static async delete(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and parse the given id
      const id: number = parseInt(req.params.id, 10);
      //2. validate if exists a book with the given id
      let bookComment: BookComment = await BookCommentModel.findById(id);
      if (bookComment.id === 0) throw new Error("Comentário do livro não encontrada");

      //3. delete bookComment
      let result: boolean = await BookCommentModel.delete(bookComment);

      //4. validate deletion
      if (true === result)
        response = { data: {}, status: { error: false, message: "Comentário do livro removido" } };
      else throw new Error("Erro ao deletar comentário do livro");
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao excluir comentário do livro",
        },
      };
    }

    res.json(response);
  }

  /**
   * Create a bookComment
   * description: body of the book comment
   * vote: the vote true or false
   * visible: if the comment is visible or not
   * person_id - the person who comments
   * book_id - book id
   */
  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and create a bookCop with the given data
      const bookComment: BookComment = new BookComment(
        req.body.description,
        req.body.vote,
        req.body.visible
      );

      bookComment.book = await BookModel.findById(req.body.book_id);
      bookComment.person =
        req.body.person_id !== null ? await PersonModel.findById(req.body.person_id) : null;

      //2. validate bookComment data
      const resValidate: ResponseData = bookComment.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      //3. insert book
      const insertId: number = await BookCommentModel.create(bookComment);

      //4 validate insertion
      if (insertId !== 0) {
        bookComment.id = insertId;

        response = {
          data: bookComment.toJson(),
          status: { error: false, message: "Comentário do livro inserido" },
        };
      } else throw new Error("Erro ao inserir comentário do livro");
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao criar comentário do livro",
        },
      };
    }

    res.json(response);
  }

  /**
   * Edit a bookComment
   * description: body of the book comment
   * vote: the vote true or false
   * visible: if the comment is visible or not
   * person_id - the person who comments
   * book_id - book id
   */
  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const id: number = parseInt(req.params.id);

      //1. get and create a bookCop with the given data
      const bookComment: BookComment = new BookComment(
        req.body.description,
        req.body.vote,
        req.body.visible,
        id
      );

      bookComment.book = await BookModel.findById(req.body.book_id);
      bookComment.person =
        req.body.person_id !== null ? await PersonModel.findById(req.body.person_id) : null;

      //2. validate book data
      const resValidate: ResponseData = bookComment.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      //4. update bookComment
      const bookCommentUpdated: boolean = await BookCommentModel.update(bookComment);

      //5 validate update
      if (bookCommentUpdated !== false) {
        response = {
          data: bookComment.toJson(),
          status: { error: false, message: "Comentário do livro atualizado" },
        };
      } else throw new Error("Erro ao atualizar o comentário do livro");
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao atualizar o comentário do livro",
        },
      };
    }

    res.json(response);
  }
}
