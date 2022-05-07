import { ResultSetHeader } from "mysql2";
import DatabaseConnection from "../../db/db";
import Author from "../classes/Author.class";
import Book from "../classes/Book.class";
import Country from "../classes/Country.class";
import Genre from "../classes/Genre.class";
import Idiom from "../classes/Idiom.class";
import Publisher from "../classes/Publisher.class";
import Style from "../classes/Style.class";
import { BookData, BookDataSQL } from "../interfaces/Book.interface";
import AuthorModel from "./Author.model";

//get connection
const conn = DatabaseConnection.getConnection();

export default class BookModel {
  /**
   * return a @Book instance
   * @param bookData @BookData interface with data
   */
  private static generateBookFromData(bookDataSql: BookDataSQL): BookData {
    let bookData: BookData = {
      id: bookDataSql.id,
      name: bookDataSql.name,
      volumn: bookDataSql.volumn,
      number_pages: bookDataSql.number_pages,
      edition: bookDataSql.edition,
      release_year: bookDataSql.release_year,
      author_obs: bookDataSql.author_obs,
      obs: bookDataSql.obs,
      isbn: bookDataSql.isbn,
      publisher:
        null === bookDataSql.publisher_id
          ? null
          : new Publisher(
              bookDataSql.publisher_name || "",
              new Country(
                bookDataSql.publisher_country_name || "",
                bookDataSql.publisher_country_fullName,
                bookDataSql.publisher_country_short || "",
                bookDataSql.publisher_country_flag,
                bookDataSql.publisher_country_id
              ),
              bookDataSql.publisher_id
            ),
      style:
        null === bookDataSql.style_id
          ? null
          : new Style(bookDataSql.style_description || "", bookDataSql.style_id),
      genre:
        null === bookDataSql.genre_id
          ? null
          : new Genre(bookDataSql.genre_description || "", bookDataSql.genre_id),
      idiom:
        null === bookDataSql.idiom_id
          ? null
          : new Idiom(bookDataSql.idiom_description || "", bookDataSql.idiom_id),
      authors: null,
    };

    return bookData;
  }

  /**
   * Find a book with the given id
   * @param id - book's id - 1
   * @return Promise<Book> a @Book instance, if id is 0 the book does not exists
   */
  public static async findById(id: number): Promise<Book> {
    //1. execute sql with the id
    const [rows] = await (
      await conn
    ).execute(
      "SELECT b.id, b.name, b.volumn, b.number_pages, b.edition, b.release_year, b.author_obs, b.obs, b.isbn, " +
        "b.publisher_id, p.name as publisher_name, p.country_id as publisher_country_id, c.name as publisher_country_name, " +
        "c.fullName as publisher_country_fullName, c.short as publisher_country_short, c.flag as publisher_country_flag, " +
        "b.style_id, s.description as style_description, " +
        "b.genre_id, g.description as genre_description, " +
        "b.idiom_id, i.description as idiom_description " +
        "FROM book b " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "LEFT JOIN style s ON s.id = b.style_id " +
        "LEFT JOIN genre g ON g.id = b.genre_id " +
        "LEFT JOIN idiom i ON i.id = b.idiom_id " +
        "WHERE b.id = ?",
      [id.toString()]
    );
    //2. get data
    let book: Book;
    if (undefined !== Object.values(rows)[0]) {
      let arrBook: BookData = this.generateBookFromData(Object.values(rows)[0]);
      //3. if book list is undefined return id = 0
      book = new Book(
        arrBook.name,
        arrBook.volumn,
        arrBook.number_pages,
        arrBook.edition,
        arrBook.release_year,
        arrBook.author_obs,
        arrBook.obs,
        arrBook.isbn,
        arrBook.id
      );
      let authorsBook: Author[] = await AuthorModel.findAllAuthorsFromBook(id);
      book.authors = authorsBook;
      book.publisher = arrBook.publisher;
      book.style = arrBook.style;
      book.genre = arrBook.genre;
      book.idiom = arrBook.idiom;
    } else book = new Book();

    return book;
  }

  /**
   * Find a book with the given isbn
   * @param isbn - book's isbn - 1234567891011
   * @param id - book's isbn - 1
   * @return Promise<Book> a @Book instance, if id is 0 the book does not exists
   */
  public static async findByIsbn(isbn: string, currentId = 0): Promise<Book> {
    //1. verify if already exist
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql =
        "SELECT b.id, b.name, b.volumn, b.number_pages, b.edition, b.release_year, b.author_obs, b.obs, b.isbn, " +
        "b.publisher_id, p.name as publisher_name, p.country_id as publisher_country_id, c.name as publisher_country_name, " +
        "c.fullName as publisher_country_fullName, c.short as publisher_country_short, c.flag as publisher_country_flag, " +
        "b.style_id, s.description as style_description, " +
        "b.genre_id, g.description as genre_description, " +
        "b.idiom_id, i.description as idiom_description " +
        "FROM book b " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "LEFT JOIN style s ON s.id = b.style_id " +
        "LEFT JOIN genre g ON g.id = b.genre_id " +
        "LEFT JOIN idiom i ON i.id = b.idiom_id " +
        "WHERE b.isbn = ? ";
      data = [isbn];
    } else {
      sql =
        "SELECT b.id, b.name, b.volumn, b.number_pages, b.edition, b.release_year, b.author_obs, b.obs, b.isbn, " +
        "b.publisher_id, p.name as publisher_name, p.country_id as publisher_country_id, c.name as publisher_country_name, " +
        "c.fullName as publisher_country_fullName, c.short as publisher_country_short, c.flag as publisher_country_flag, " +
        "b.style_id, s.description as style_description, " +
        "b.genre_id, g.description as genre_description, " +
        "b.idiom_id, i.description as idiom_description " +
        "FROM book b " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "LEFT JOIN style s ON s.id = b.style_id " +
        "LEFT JOIN genre g ON g.id = b.genre_id " +
        "LEFT JOIN idiom i ON i.id = b.idiom_id " +
        "WHERE b.isbn = ? AND b.id <> ?";
      data = [isbn, currentId.toString()];
    }
    //2. execute sql with the isbn
    const [rows] = await (await conn).execute(sql, data);
    //3. get data
    let book: Book;
    if (undefined !== Object.values(rows)[0]) {
      let arrBook: BookData = this.generateBookFromData(Object.values(rows)[0]);
      //4. if book list is undefined return id = 0
      book = new Book(
        arrBook.name,
        arrBook.volumn,
        arrBook.number_pages,
        arrBook.edition,
        arrBook.release_year,
        arrBook.author_obs,
        arrBook.obs,
        arrBook.isbn,
        arrBook.id
      );
      let authorsBook: Author[] = await AuthorModel.findAllAuthorsFromBook(book.id);
      book.authors = authorsBook;
      book.style = arrBook.style;
      book.publisher = arrBook.publisher;
      book.genre = arrBook.genre;
      book.idiom = arrBook.idiom;
    } else book = new Book();

    return book;
  }

  /**
   * Find a book with the given name
   * @param id - book's id - 1
   * @param name - book's name - Casmurro
   * @return Promise<Book> a @Book instance, if id is 0 the book does not exists
   */
  public static async findByName(name: string, currentId = 0): Promise<Book> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql =
        "SELECT b.id, b.name, b.volumn, b.number_pages, b.edition, b.release_year, b.author_obs, b.obs, b.isbn, " +
        "b.publisher_id, p.name as publisher_name, p.country_id as publisher_country_id, c.name as publisher_country_name, " +
        "c.fullName as publisher_country_fullName, c.short as publisher_country_short, c.flag as publisher_country_flag, " +
        "b.style_id, s.description as style_description, " +
        "b.genre_id, g.description as genre_description, " +
        "b.idiom_id, i.description as idiom_description " +
        "FROM book b " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "LEFT JOIN style s ON s.id = b.style_id " +
        "LEFT JOIN genre g ON g.id = b.genre_id " +
        "LEFT JOIN idiom i ON i.id = b.idiom_id " +
        "WHERE b.name = ? ";
      data = [name];
    } else {
      sql =
        "SELECT b.id, b.name, b.volumn, b.number_pages, b.edition, b.release_year, b.author_obs, b.obs, b.isbn, " +
        "b.publisher_id, p.name as publisher_name, p.country_id as publisher_country_id, c.name as publisher_country_name, " +
        "c.fullName as publisher_country_fullName, c.short as publisher_country_short, c.flag as publisher_country_flag, " +
        "b.style_id, s.description as style_description, " +
        "b.genre_id, g.description as genre_description, " +
        "b.idiom_id, i.description as idiom_description " +
        "FROM book b " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "LEFT JOIN style s ON s.id = b.style_id " +
        "LEFT JOIN genre g ON g.id = b.genre_id " +
        "LEFT JOIN idiom i ON i.id = b.idiom_id " +
        "WHERE b.name = ? AND b.id <> ?";
      data = [name, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let book: Book;

    if (undefined !== Object.values(rows)[0]) {
      let arrBook: BookData = this.generateBookFromData(Object.values(rows)[0]);

      book = new Book(
        arrBook.name,
        arrBook.volumn,
        arrBook.number_pages,
        arrBook.edition,
        arrBook.release_year,
        arrBook.author_obs,
        arrBook.obs,
        arrBook.isbn,
        arrBook.id
      );
      let authorsBook: Author[] = await AuthorModel.findAllAuthorsFromBook(book.id);
      book.authors = authorsBook;
      book.publisher = arrBook.publisher;
      book.style = arrBook.style;
      book.genre = arrBook.genre;
      book.idiom = arrBook.idiom;
    } else book = new Book();

    return book;
  }

  /**
   * Create a book
   * @param book - the book to insert
   * @return Promise<number> the id of the inserted book
   */
  public static async create(book: Book): Promise<number> {
    //1. execute sql to insert the book
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute(
      "INSERT INTO book (name, volumn, number_pages, edition, release_year, author_obs, obs, isbn, publisher_id, style_id, genre_id, idiom_id) " +
        " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        book.name,
        book.volumn,
        book.number_pages,
        book.edition,
        book.release_year,
        book.author_obs,
        book.obs,
        book.isbn,
        null == book.publisher ? null : book.publisher.id,
        null == book.style ? null : book.style.id,
        null == book.genre ? null : book.genre.id,
        null == book.idiom ? null : book.idiom.id,
      ]
    );

    let bookId: number;
    //2. if returned id is undefined returns 0 for function else returns the id
    if (undefined !== rst[0].insertId) bookId = rst[0].insertId;
    else bookId = 0;

    return bookId;
  }

  /**
   * Create the vinculation between author and book
   * @param authors[] - author_id list - 1,2,3,4
   * @param bookId - book id - 1
   * @return Promise<boolean> true or false if the created
   */
  public static async createVinculationBooksAndAuthors(
    authors: Author[],
    bookId: number
  ): Promise<boolean> {
    let success = true;
    await Promise.all(
      authors.map(async (at) => {
        const rst: ResultSetHeader | any = await (
          await conn
        ).execute("INSERT INTO book_author (author_id, book_id) VALUES (?, ?)", [at.id, bookId]);

        if (undefined === rst[0].insertId) success = false;
      })
    );

    return success;
  }

  /**
   * Find all the books
   * @return Promise<Book[]> a list of @Book instances
   */
  public static async findAll(): Promise<Book[]> {
    let allBooks: Book[] = [];
    //1. execute sql
    const [rows] = await (
      await conn
    ).execute(
      "SELECT b.id, b.name, b.volumn, b.number_pages, b.edition, b.release_year, b.author_obs, b.obs, b.isbn, " +
        "b.publisher_id, p.name as publisher_name, p.country_id as publisher_country_id, c.name as publisher_country_name, " +
        "c.fullName as publisher_country_fullName, c.short as publisher_country_short, c.flag as publisher_country_flag, " +
        "b.style_id, s.description as style_description, " +
        "b.genre_id, g.description as genre_description, " +
        "b.idiom_id, i.description as idiom_description " +
        "FROM book b " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "LEFT JOIN style s ON s.id = b.style_id " +
        "LEFT JOIN genre g ON g.id = b.genre_id " +
        "LEFT JOIN idiom i ON i.id = b.idiom_id "
    );
    /**
     * 2. for each book create a @Book instance
     */
    await Promise.all(
      Object.values(rows).map(async (el: BookDataSQL) => {
        let arrBook: BookData = this.generateBookFromData(el);

        let newBook = new Book(
          arrBook.name,
          arrBook.volumn,
          arrBook.number_pages,
          arrBook.edition,
          arrBook.release_year,
          arrBook.author_obs,
          arrBook.obs,
          arrBook.isbn,
          arrBook.id
        );

        newBook.authors = await AuthorModel.findAllAuthorsFromBook(newBook.id);
        newBook.publisher = arrBook.publisher;
        newBook.style = arrBook.style;
        newBook.genre = arrBook.genre;
        newBook.idiom = arrBook.idiom;

        allBooks.push(newBook);
      })
    );

    return allBooks;
  }

  /**
   * update a book
   * @param book - the book to update
   * @return Promise<boolean> true or false, updated or not
   */
  public static async update(book: Book): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute(
      "UPDATE book SET name = ?, volumn = ?, number_pages = ?, edition = ?, release_year = ?, author_obs = ?, obs = ?, isbn = ?, " +
        "publisher_id = ?, style_id = ?, genre_id = ?, idiom_id = ? " +
        " WHERE id = ?",
      [
        book.name,
        book.volumn,
        book.number_pages,
        book.edition,
        book.release_year,
        book.author_obs,
        book.obs,
        book.isbn,
        null == book.publisher ? null : book.publisher.id,
        null == book.style ? null : book.style.id,
        null == book.genre ? null : book.genre.id,
        null == book.idiom ? null : book.idiom.id,
        book.id,
      ]
    );

    let cr: boolean;
    //2. if return id is undefined returns 0 for function, else returns the id
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }

  /**
   * Update the vinculation between author and book
   * @param number[] - book_author I=id list - 1,2,3,4
   * @return Promise<boolean> true or false if the created
   */
  public static async deleteVinculationBooksAndAuthors(
    authors: Author[],
    bookId: number
  ): Promise<boolean> {
    let success = true;
    await Promise.all(
      authors.map(async (author: Author) => {
        const rst: ResultSetHeader | any = await (
          await conn
        ).execute("DELETE FROM book_author WHERE author_id = ? AND book_id = ?", [
          author.id,
          bookId,
        ]);
        if (undefined === rst[0].insertId) success = false;
      })
    );

    return success;
  }

  /**
   * delete a book
   * @param book - the book to delete
   * @return Promise<boolean> true or false, deleted or not
   */
  public static async delete(book: Book): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM book WHERE id = ?", [book.id]);
    let cr: boolean;
    //2. returns true or false based in sql result
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
