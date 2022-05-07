import { ResultSetHeader } from "mysql2";
import DatabaseConnection from "../../db/db";
import Author from "../classes/Author.class";
import Book from "../classes/Book.class";
import BookCopy from "../classes/BookCopy.class";
import Country from "../classes/Country.class";
import Genre from "../classes/Genre.class";
import Idiom from "../classes/Idiom.class";
import Person from "../classes/Person.class";
import Publisher from "../classes/Publisher.class";
import Style from "../classes/Style.class";
import { BookCopyDataInterfaces, BookCopyDataSQL } from "../interfaces/BookCopy.interface";
import AuthorModel from "./Author.model";

//get connection
const conn = DatabaseConnection.getConnection();

export default class BookCopyModel {
  /**
   * return a @BookCopy instance
   * @param bookCopyDataSql @BookCopyDataSQL interface with data
   */
  private static generateBookFromData(bookCopyDataSql: BookCopyDataSQL): BookCopyDataInterfaces {
    let bookCopyData: BookCopyDataInterfaces = {
      id: bookCopyDataSql.id,
      description: bookCopyDataSql.description,
      buy_or_gift: bookCopyDataSql.buy_or_gift,
      buy_or_gift_date: bookCopyDataSql.buy_or_gift_date,
      obs: bookCopyDataSql.obs,
      photo: bookCopyDataSql.photo,
      receiver_person: {
        id_person: bookCopyDataSql.receiver_person_id,
        name: bookCopyDataSql.receiver_person_name,
        email: bookCopyDataSql.receiver_person_email,
        phone: bookCopyDataSql.receiver_person_phone,
        birth_date: bookCopyDataSql.receiver_person_birth_date,
        cpf: bookCopyDataSql.receiver_person_cpf,
        address: bookCopyDataSql.receiver_person_address,
        city: bookCopyDataSql.receiver_person_city,
        state: bookCopyDataSql.receiver_person_state,
      },
      book: {
        id: bookCopyDataSql.id,
        name: bookCopyDataSql.book_name,
        volumn: bookCopyDataSql.book_volumn,
        number_pages: bookCopyDataSql.book_number_pages,
        edition: bookCopyDataSql.book_edition,
        release_year: bookCopyDataSql.book_release_year,
        author_obs: bookCopyDataSql.book_author_obs,
        obs: bookCopyDataSql.book_obs,
        isbn: bookCopyDataSql.book_isbn,
        publisher:
          null === bookCopyDataSql.book_publisher_id
            ? null
            : {
                id: bookCopyDataSql.book_publisher_id,
                name: bookCopyDataSql.book_publisher_name,
                country: {
                  id: bookCopyDataSql.book_publisher_country_id,
                  name: bookCopyDataSql.book_publisher_country_name || "",
                  fullName: bookCopyDataSql.book_publisher_country_fullName,
                  short: bookCopyDataSql.book_publisher_country_short || "",
                  flag: bookCopyDataSql.book_publisher_country_flag,
                },
              },
        style:
          null === bookCopyDataSql.book_style_id
            ? null
            : {
                id: bookCopyDataSql.book_style_id,
                description: bookCopyDataSql.book_style_description || "",
              },
        genre:
          null === bookCopyDataSql.book_genre_id
            ? null
            : {
                id: bookCopyDataSql.book_genre_id,
                description: bookCopyDataSql.book_genre_description || "",
              },
        idiom:
          null === bookCopyDataSql.book_idiom_id
            ? null
            : {
                id: bookCopyDataSql.book_idiom_id,
                description: bookCopyDataSql.book_idiom_description || "",
              },
        authors: null,
      },
    };

    return bookCopyData;
  }

  /**
   * Find a bookcopy with the given id
   * @param id - bookcopy's id - 1
   * @return Promise<BookCopy> a @BookCopy instance, if id is 0 the book copy does not exists
   */
  public static async findById(id: number): Promise<BookCopy> {
    //1. execute sql with the id
    const [rows] = await (
      await conn
    ).execute(
      "SELECT bc.id, bc.description, bc.buy_or_gift, DATE_FORMAT(bc.buy_or_gift_date, '%Y-%m-%d') as buy_or_gift_date, bc.obs, bc.photo, " +
        "bc.receiver_person_id, pe.name as receiver_person_name, pe.email as receiver_person_email, pe.phone as receiver_person_phone, DATE_FORMAT(pe.birth_date, '%Y-%m-%d') as receiver_person_birth_date," +
        "pe.cpf as receiver_person_cpf, pe.address as receiver_person_address, pe.city as receiver_person_city, pe.state as receiver_person_state," +
        "b.id as book_id, b.name as book_name, b.volumn as book_volumn, b.number_pages as book_number_pages, b.edition as book_edition, b.release_year as book_release_year, b.author_obs as book_author_obs, b.obs as book_obs, b.isbn as book_isbn, " +
        "b.publisher_id as book_publisher_id, p.name as book_publisher_name, p.country_id as book_publisher_country_id, c.name as book_publisher_country_name, " +
        "c.fullName as book_publisher_country_fullName, c.short as book_publisher_country_short, c.flag as book_publisher_country_flag, " +
        "b.style_id as book_style_id, s.description as book_style_description, " +
        "b.genre_id as book_genre_id, g.description as book_genre_description, " +
        "b.idiom_id as book_idiom_id, i.description as book_idiom_description " +
        "FROM book_copy bc " +
        "LEFT JOIN book b ON b.id = bc.book_id " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "LEFT JOIN style s ON s.id = b.style_id " +
        "LEFT JOIN genre g ON g.id = b.genre_id " +
        "LEFT JOIN idiom i ON i.id = b.idiom_id " +
        "LEFT JOIN person pe on pe.id = bc.receiver_person_id " +
        "WHERE bc.id = ?",
      [id.toString()]
    );
    //2. get data
    let bookCopy: BookCopy;
    if (undefined !== Object.values(rows)[0]) {
      let arrBookCopy: BookCopyDataInterfaces = this.generateBookFromData(Object.values(rows)[0]);
      let book = new Book(
        arrBookCopy.book.name,
        arrBookCopy.book.volumn,
        arrBookCopy.book.number_pages,
        arrBookCopy.book.edition,
        arrBookCopy.book.release_year,
        arrBookCopy.book.author_obs,
        arrBookCopy.book.obs,
        arrBookCopy.book.isbn,
        arrBookCopy.book.id
      );
      let authorsBook: Author[] = await AuthorModel.findAllAuthorsFromBook(arrBookCopy.book.id);
      book.authors = authorsBook;
      book.publisher =
        null == arrBookCopy.book.publisher?.id
          ? null
          : new Publisher(
              arrBookCopy.book.publisher?.name,
              new Country(
                arrBookCopy.book.publisher?.country.name,
                arrBookCopy.book.publisher?.country.fullName,
                arrBookCopy.book.publisher?.country.short,
                arrBookCopy.book.publisher?.country.flag,
                arrBookCopy.book.publisher?.country.id
              ),
              arrBookCopy.book.publisher?.id
            );
      book.style =
        null == arrBookCopy.book.style?.id
          ? null
          : new Style(arrBookCopy.book.style.description, arrBookCopy.book.style.id);
      book.genre =
        null == arrBookCopy.book.genre?.id
          ? null
          : new Genre(arrBookCopy.book.genre.description, arrBookCopy.book.genre.id);
      book.idiom =
        null == arrBookCopy.book.idiom?.id
          ? null
          : new Idiom(arrBookCopy.book.idiom.description, arrBookCopy.book.idiom.id);

      let person_receiver = new Person(
        arrBookCopy.receiver_person.name,
        arrBookCopy.receiver_person.email,
        arrBookCopy.receiver_person.phone,
        arrBookCopy.receiver_person.birth_date,
        arrBookCopy.receiver_person.cpf,
        arrBookCopy.receiver_person.address,
        arrBookCopy.receiver_person.city,
        arrBookCopy.receiver_person.state,
        arrBookCopy.receiver_person.id_person
      );
      //3. if book list is undefined return id = 0
      bookCopy = new BookCopy(
        arrBookCopy.description,
        arrBookCopy.buy_or_gift,
        arrBookCopy.buy_or_gift_date,
        arrBookCopy.obs,
        person_receiver,
        book,
        arrBookCopy.photo,
        arrBookCopy.id
      );
    } else bookCopy = new BookCopy();

    return bookCopy;
  }

  /**
   * Find all the book copy
   * @return Promise<BookCopy[]> a list of @BookCopy instances
   */
  public static async findAll(): Promise<BookCopy[]> {
    let allBooks: BookCopy[] = [];
    //1. execute sql
    const [rows] = await (
      await conn
    ).execute(
      "SELECT bc.id, bc.description, bc.buy_or_gift, DATE_FORMAT(bc.buy_or_gift_date, '%Y-%m-%d') as buy_or_gift_date, bc.obs, bc.photo, " +
        "bc.receiver_person_id, pe.name as receiver_person_name, pe.email as receiver_person_email, pe.phone as receiver_person_phone, DATE_FORMAT(pe.birth_date, '%Y-%m-%d') as receiver_person_birth_date," +
        "pe.cpf as receiver_person_cpf, pe.address as receiver_person_address, pe.city as receiver_person_city, pe.state as receiver_person_state," +
        "b.id as book_id, b.name as book_name, b.volumn as book_volumn, b.number_pages as book_number_pages, b.edition as book_edition, b.release_year as book_release_year, b.author_obs as book_author_obs, b.obs as book_obs, b.isbn as book_isbn, " +
        "b.publisher_id as book_publisher_id, p.name as book_publisher_name, p.country_id as book_publisher_country_id, c.name as book_publisher_country_name, " +
        "c.fullName as book_publisher_country_fullName, c.short as book_publisher_country_short, c.flag as book_publisher_country_flag, " +
        "b.style_id as book_style_id, s.description as book_style_description, " +
        "b.genre_id as book_genre_id, g.description as book_genre_description, " +
        "b.idiom_id as book_idiom_id, i.description as book_idiom_description " +
        "FROM book_copy bc " +
        "LEFT JOIN book b ON b.id = bc.book_id " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "LEFT JOIN style s ON s.id = b.style_id " +
        "LEFT JOIN genre g ON g.id = b.genre_id " +
        "LEFT JOIN idiom i ON i.id = b.idiom_id " +
        "LEFT JOIN person pe on pe.id = bc.receiver_person_id "
    );
    /**
     * 2. for each book create a @Book instance
     */
    await Promise.all(
      Object.values(rows).map(async (el: BookCopyDataSQL) => {
        let arrBookCopy: BookCopyDataInterfaces = this.generateBookFromData(el);

        let book = new Book(
          arrBookCopy.book.name,
          arrBookCopy.book.volumn,
          arrBookCopy.book.number_pages,
          arrBookCopy.book.edition,
          arrBookCopy.book.release_year,
          arrBookCopy.book.author_obs,
          arrBookCopy.book.obs,
          arrBookCopy.book.isbn,
          arrBookCopy.book.id
        );
        let authorsBook: Author[] = await AuthorModel.findAllAuthorsFromBook(arrBookCopy.book.id);
        book.authors = authorsBook;
        book.publisher =
          null == arrBookCopy.book.publisher?.id
            ? null
            : new Publisher(
                arrBookCopy.book.publisher?.name,
                new Country(
                  arrBookCopy.book.publisher?.country.name,
                  arrBookCopy.book.publisher?.country.fullName,
                  arrBookCopy.book.publisher?.country.short,
                  arrBookCopy.book.publisher?.country.flag,
                  arrBookCopy.book.publisher?.country.id
                ),
                arrBookCopy.book.publisher?.id
              );
        book.style =
          null == arrBookCopy.book.style?.id
            ? null
            : new Style(arrBookCopy.book.style.description, arrBookCopy.book.style.id);
        book.genre =
          null == arrBookCopy.book.genre?.id
            ? null
            : new Genre(arrBookCopy.book.genre.description, arrBookCopy.book.genre.id);
        book.idiom =
          null == arrBookCopy.book.idiom?.id
            ? null
            : new Idiom(arrBookCopy.book.idiom.description, arrBookCopy.book.idiom.id);

        let person_receiver = new Person(
          arrBookCopy.receiver_person.name,
          arrBookCopy.receiver_person.email,
          arrBookCopy.receiver_person.phone,
          arrBookCopy.receiver_person.birth_date,
          arrBookCopy.receiver_person.cpf,
          arrBookCopy.receiver_person.address,
          arrBookCopy.receiver_person.city,
          arrBookCopy.receiver_person.state,
          arrBookCopy.receiver_person.id_person
        );
        //3. if book list is undefined return id = 0
        let bookCopy = new BookCopy(
          arrBookCopy.description,
          arrBookCopy.buy_or_gift,
          arrBookCopy.buy_or_gift_date,
          arrBookCopy.obs,
          person_receiver,
          book,
          arrBookCopy.photo,
          arrBookCopy.id
        );

        allBooks.push(bookCopy);
      })
    );

    return allBooks;
  }

  /**
   * Create a book copy
   * @param bookCopy - the book copy to insert
   * @return Promise<number> the id of the inserted book
   */
  public static async create(bookCopy: BookCopy): Promise<number> {
    //1. execute sql to insert the book
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute(
      "INSERT INTO book_copy (description, buy_or_gift, buy_or_gift_date, obs, photo, receiver_person_id, book_id) " +
        " VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        bookCopy.description,
        bookCopy.buy_or_gift,
        bookCopy.buy_or_gift_date,
        bookCopy.obs,
        bookCopy.photo,
        bookCopy.receiver_person.id_person,
        bookCopy.book.id,
      ]
    );

    let bookId: number;
    //2. if returned id is undefined returns 0 for function else returns the id
    if (undefined !== rst[0].insertId) bookId = rst[0].insertId;
    else bookId = 0;

    return bookId;
  }

  /**
   * update a book copy
   * @param bookCopy - the bookCopy to update
   * @return Promise<boolean> true or false, updated or not
   */
  public static async update(bookCopy: BookCopy): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute(
      "UPDATE book_copy SET description = ?, buy_or_gift = ?, buy_or_gift_date = ?, obs = ?, photo = ?, receiver_person_id = ?, book_id = ? " +
        " WHERE id = ?",
      [
        bookCopy.description,
        bookCopy.buy_or_gift,
        bookCopy.buy_or_gift_date,
        bookCopy.obs,
        bookCopy.photo,
        bookCopy.receiver_person.id_person,
        bookCopy.book.id,
        bookCopy.id,
      ]
    );

    let cr: boolean;
    //2. if return id is undefined returns 0 for function, else returns the id
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }

  /**
   * delete a book copy
   * @param bookCopy - the book copy to delete
   * @return Promise<boolean> true or false, deleted or not
   */
  public static async delete(bookCopy: BookCopy): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM book_copy WHERE id = ?", [bookCopy.id]);
    let cr: boolean;
    //2. returns true or false based in sql result
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
