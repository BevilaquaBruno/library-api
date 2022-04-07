import { Request, Response } from "express";
import BookModel from "../models/Book.model";
import Book from "../classes/Book.class";
import { ResponseData } from "../interfaces/Common.interface";
import PublisherModel from "../models/Publisher.model";
import AuthorModel from "../models/Author.model";
import StyleModel from "../models/Style.model";
import GenreModel from "../models/Genre.model";
import IdiomModel from "../models/Idiom.model";
import Author from "../classes/Author.class";

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

  /**
   * Create a book
   * name: name of the book - Dom Casmurro
   * volumn: volumn number - 1
   * number_pages: number pages - 100
   * edition: edition of the book - 1
   * release_year: release year - 2000
   * author_obs - text about the author(s) - Writed at university
   * obs - obs about the book - book donated
   * isbn - bookisbn - 9781716221330
   * publisher_id - publisher id - 1
   * style_id - style id - 1
   * genre_id - genre id - 1
   * idiom_id - idiom id - 1
   * authors - list of author_id - [1, 2, 3]
   */
  public static async create(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get and create a book with the given data
      const book: Book = new Book(
        req.body.name,
        req.body.volumn,
        req.body.number_pages,
        req.body.edition,
        req.body.release_year,
        req.body.author_obs,
        req.body.obs,
        req.body.isbn
      );

      book.authors =
        0 === req.body.authors.length
          ? null
          : await AuthorModel.findAllAuthorsFromIdList(req.body.authors);
      book.publisher =
        "" === req.body.publisher_id ? null : await PublisherModel.findById(req.body.publisher_id);
      book.style = "" === req.body.style_id ? null : await StyleModel.findById(req.body.style_id);
      book.genre = "" === req.body.genre_id ? null : await GenreModel.findById(req.body.genre_id);
      book.idiom = "" === req.body.idiom_id ? null : await IdiomModel.findById(req.body.idiom_id);

      //2. validate book data
      const resValidate: ResponseData = book.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let bookValidate: Book;
      bookValidate = await BookModel.findByName(book.name);
      if (0 !== bookValidate.id) throw new Error("Já existe um livro com esse nome");

      if (null !== book.isbn) {
        bookValidate = await BookModel.findByIsbn(book.isbn);
        if (0 !== bookValidate.id) throw new Error("Já existe um livro com esse isbn");
      }

      //4. insert book
      const insertId: number = await BookModel.create(book);

      //5 validate insertion
      if (insertId !== 0) {
        book.id = insertId;
        if (null !== book.authors) {
          const authors_inserted = await BookModel.createVinculationBooksAndAuthors(
            book.authors,
            book.id
          );
          if (true === authors_inserted) {
            response = {
              data: book.toJson(),
              status: { error: false, message: "Livro cadastrado" },
            };
          } else
            throw new Error(
              "O livro foi inserido, mas houve um erro ao vincular os autores ao livro, edite o livro e vincule novamente"
            );
        } else {
          response = {
            data: book.toJson(),
            status: { error: false, message: "Livro cadastrado" },
          };
        }
      } else throw new Error("Erro ao inserir livro");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao criar livro" },
      };
    }

    res.json(response);
  }

  /**
   * List all books
   */
  public static async findAll(req: Request, res: Response) {
    let response: ResponseData;

    try {
      //1. get books in database
      const book: Book[] = await BookModel.findAll();

      /**
       * 2. map then to get the @toJson data
       */
      response = {
        data: book.map((ct) => ct.toJson()),
        status: { error: false, message: "Lista de todos os livros" },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro ao buscar dados dos livros",
        },
      };
    }

    res.json(response);
  }

  /**
   * Update a book
   * name: name of the book - Dom Casmurro
   * volumn: volumn number - 1
   * number_pages: number pages - 100
   * edition: edition of the book - 1
   * release_year: release year - 2000
   * author_obs - text about the author(s) - Writed at university
   * obs - obs about the book - book donated
   * isbn - bookisbn - 9781716221330
   * publisher_id - publisher id - 1
   * style_id - style id - 1
   * genre_id - genre id - 1
   * idiom_id - idiom id - 1
   * authors - list of author_id - [1, 2, 3]
   */
  public static async update(req: Request, res: Response) {
    let response: ResponseData;

    try {
      const id: number = parseInt(req.params.id);

      //1. get and create a book with the given data
      const book: Book = new Book(
        req.body.name,
        req.body.volumn,
        req.body.number_pages,
        req.body.edition,
        req.body.release_year,
        req.body.author_obs,
        req.body.obs,
        req.body.isbn,
        id
      );

      book.authors =
        0 === req.body.authors.length
          ? null
          : await AuthorModel.findAllAuthorsFromIdList(req.body.authors);
      book.publisher =
        "" === req.body.publisher_id ? null : await PublisherModel.findById(req.body.publisher_id);
      book.style = "" === req.body.style_id ? null : await StyleModel.findById(req.body.style_id);
      book.genre = "" === req.body.genre_id ? null : await GenreModel.findById(req.body.genre_id);
      book.idiom = "" === req.body.idiom_id ? null : await IdiomModel.findById(req.body.idiom_id);

      //2. validate book data
      const resValidate: ResponseData = book.validate();
      if (true === resValidate.status.error) throw new Error(resValidate.status.message);

      let bookValidate: Book;
      bookValidate = await BookModel.findByName(book.name, book.id);
      if (0 !== bookValidate.id) throw new Error("Já existe um livro com esse nome");

      if (null !== book.isbn) {
        bookValidate = await BookModel.findByIsbn(book.isbn, book.id);
        if (0 !== bookValidate.id) throw new Error("Já existe um livro com esse isbn");
      }

      //4. insert book
      const bookUpdated: boolean = await BookModel.update(book);

      //5 validate update
      if (bookUpdated !== false) {
        let update_authors = book.authors;
        let database_authors = await AuthorModel.findAllAuthorsFromBook(book.id);
        let authors_to_delete: Author[] = [];
        let authors_to_insert: Author[] = [];

        if (null === update_authors) {
          authors_to_delete = database_authors;
        } else {
          update_authors.forEach((ua: Author) => {
            let isIn = false;

            database_authors.forEach((da: Author) => {
              if (da.id === ua.id) isIn = true;
            });

            if (false === isIn) {
              authors_to_insert.push(ua);
            }
          });

          database_authors.forEach((da: Author) => {
            let isIn = false;

            if (null != update_authors) {
              update_authors.forEach((ua: Author) => {
                if (da.id === ua.id) isIn = true;
              });
            }

            if (false === isIn) {
              authors_to_delete.push(da);
            }
          });
        }

        let authors_deleted = await BookModel.deleteVinculationBooksAndAuthors(
          authors_to_delete,
          book.id
        );
        let authors_inserted = await BookModel.createVinculationBooksAndAuthors(
          authors_to_insert,
          book.id
        );

        if (true === authors_inserted && true === authors_deleted) {
          response = {
            data: book.toJson(),
            status: { error: false, message: "Livro atualizado" },
          };
        } else
          throw new Error(
            "O livro foi inserido, mas houve um erro ao vincular e remover os autores ao livro, edite o livro e altere os autores novamente"
          );
      } else throw new Error("Erro ao atualizar o livro");
    } catch (e: any) {
      response = {
        data: {},
        status: { error: true, message: (e as Error)?.message ?? "Erro ao atualizar livro" },
      };
    }

    res.json(response);
  }
}
