import DatabaseConnection from "../../db/db";
import Author from "../classes/Author.class";
import Book from "../classes/Book.class";
import Country from "../classes/Country.class";
import Publisher from "../classes/Publisher.class";
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
        "c.fullName as publisher_country_fullName, c.short as publisher_country_short, c.flag as publisher_country_flag " +
        "FROM book b " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
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
        arrBook.publisher,
        arrBook.id
      );
      let authorsBook: Author[] = await AuthorModel.findAllAuthorsFromBook(id);
      book.authors = authorsBook;
    } else book = new Book();

    return book;
  }
}
