import DatabaseConnection from "../../db/db";
import Author from "../classes/Author.class";
import Book from "../classes/Book.class";
import BookComment from "../classes/BookComment.class";
import Country from "../classes/Country.class";
import Genre from "../classes/Genre.class";
import Idiom from "../classes/Idiom.class";
import Person from "../classes/Person.class";
import Publisher from "../classes/Publisher.class";
import Style from "../classes/Style.class";
import {
  BookCommentData,
  BookCommentDataInterfaces,
  BookCommentDataSQL,
} from "../interfaces/BookComment.interface";
import AuthorModel from "./Author.model";

//get connection
const conn = DatabaseConnection.getConnection();

export default class BookCommentModel {
  /**
   * return a @Author instance
   * @param authorData @AuthorData interface with data
   */
  private static generateBookCommentFromData(
    bookCommentDataSQL: BookCommentDataSQL
  ): BookCommentDataInterfaces {
    let current_person = null;
    if (
      null !== bookCommentDataSQL.person_id &&
      null !== bookCommentDataSQL.person_name &&
      null !== bookCommentDataSQL.person_email &&
      null !== bookCommentDataSQL.person_phone
    ) {
      current_person = {
        id_person: bookCommentDataSQL.person_id,
        name: bookCommentDataSQL.person_name,
        email: bookCommentDataSQL.person_email,
        phone: bookCommentDataSQL.person_phone,
        address: bookCommentDataSQL.person_address,
        birth_date: bookCommentDataSQL.person_birth_date,
        city: bookCommentDataSQL.person_city,
        cpf: bookCommentDataSQL.person_cpf,
        state: bookCommentDataSQL.person_state,
      };
    }
    let bookComment: BookCommentDataInterfaces = {
      id: bookCommentDataSQL.id,
      description: bookCommentDataSQL.description,
      vote: bookCommentDataSQL.vote,
      visible: bookCommentDataSQL.visible,
      person: current_person,
      book: {
        id: bookCommentDataSQL.id,
        name: bookCommentDataSQL.book_name,
        volumn: bookCommentDataSQL.book_volumn,
        number_pages: bookCommentDataSQL.book_number_pages,
        edition: bookCommentDataSQL.book_edition,
        release_year: bookCommentDataSQL.book_release_year,
        author_obs: bookCommentDataSQL.book_author_obs,
        obs: bookCommentDataSQL.book_obs,
        isbn: bookCommentDataSQL.book_isbn,
        publisher:
          null === bookCommentDataSQL.book_publisher_id
            ? null
            : {
                id: bookCommentDataSQL.book_publisher_id,
                name: bookCommentDataSQL.book_publisher_name,
                country: {
                  id: bookCommentDataSQL.book_publisher_country_id,
                  name: bookCommentDataSQL.book_publisher_country_name || "",
                  fullName: bookCommentDataSQL.book_publisher_country_fullName,
                  short: bookCommentDataSQL.book_publisher_country_short || "",
                  flag: bookCommentDataSQL.book_publisher_country_flag,
                },
              },
        style:
          null === bookCommentDataSQL.book_style_id
            ? null
            : {
                id: bookCommentDataSQL.book_style_id,
                description: bookCommentDataSQL.book_style_description || "",
              },
        genre:
          null === bookCommentDataSQL.book_genre_id
            ? null
            : {
                id: bookCommentDataSQL.book_genre_id,
                description: bookCommentDataSQL.book_genre_description || "",
              },
        idiom:
          null === bookCommentDataSQL.book_idiom_id
            ? null
            : {
                id: bookCommentDataSQL.book_idiom_id,
                description: bookCommentDataSQL.book_idiom_description || "",
              },
        authors: null,
      },
    };

    return bookComment;
  }

  /**
   * Find a bookcomment with the given id
   * @param id - bookcomment's id - 1
   * @return Promise<BookComment> a @BookComment instance, if id is 0 the book comment does not exists
   */
  public static async findById(id: number): Promise<BookComment> {
    //1. execute sql with the id
    const [rows] = await (
      await conn
    ).execute(
      "SELECT bc.id, bc.description, IF(1 = bc.vote, TRUE, FALSE) AS vote, IF(1 = bc.visible, TRUE, FALSE) AS visible, bc.person_id, pe.name as person_name, pe.email as person_email," +
        "pe.phone as person_phone, DATE_FORMAT(pe.birth_date, '%Y-%m-%d') as person_birth_date," +
        "pe.cpf as person_cpf, pe.address as person_address, pe.city as person_city, pe.state as person_state," +
        "b.id as book_id, b.name as book_name, b.volumn as book_volumn, b.number_pages as book_number_pages, b.edition as book_edition," +
        "b.release_year as book_release_year, b.author_obs as book_author_obs, b.obs as book_obs, b.isbn as book_isbn," +
        "b.publisher_id as book_publisher_id, p.name as book_publisher_name, p.country_id as book_publisher_country_id, c.name as book_publisher_country_name," +
        "c.fullName as book_publisher_country_fullName, c.short as book_publisher_country_short, c.flag as book_publisher_country_flag," +
        "b.style_id as book_style_id, s.description as book_style_description," +
        "b.genre_id as book_genre_id, g.description as book_genre_description," +
        "b.idiom_id as book_idiom_id, i.description as book_idiom_description " +
        "FROM book_comment bc " +
        "LEFT JOIN book b ON b.id = bc.book_id " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "LEFT JOIN style s ON s.id = b.style_id " +
        "LEFT JOIN genre g ON g.id = b.genre_id " +
        "LEFT JOIN idiom i ON i.id = b.idiom_id " +
        "LEFT JOIN person pe on pe.id = bc.person_id " +
        "WHERE bc.id = ?",
      [id.toString()]
    );
    //2. get data
    let bookComment: BookComment;
    if (undefined !== Object.values(rows)[0]) {
      let arrBookComment: BookCommentDataInterfaces = this.generateBookCommentFromData(
        Object.values(rows)[0]
      );

      bookComment = new BookComment(
        arrBookComment.description,
        arrBookComment.vote,
        arrBookComment.visible,
        arrBookComment.id
      );
      let book = new Book(
        arrBookComment.book.name,
        arrBookComment.book.volumn,
        arrBookComment.book.number_pages,
        arrBookComment.book.edition,
        arrBookComment.book.release_year,
        arrBookComment.book.author_obs,
        arrBookComment.book.obs,
        arrBookComment.book.isbn,
        arrBookComment.book.id
      );
      let authorsBook: Author[] = await AuthorModel.findAllAuthorsFromBook(arrBookComment.book.id);
      book.authors = authorsBook;
      book.publisher =
        null == arrBookComment.book.publisher?.id
          ? null
          : new Publisher(
              arrBookComment.book.publisher?.name,
              new Country(
                arrBookComment.book.publisher?.country.name,
                arrBookComment.book.publisher?.country.fullName,
                arrBookComment.book.publisher?.country.short,
                arrBookComment.book.publisher?.country.flag,
                arrBookComment.book.publisher?.country.id
              ),
              arrBookComment.book.publisher?.id
            );
      book.style =
        null == arrBookComment.book.style?.id
          ? null
          : new Style(arrBookComment.book.style.description, arrBookComment.book.style.id);
      book.genre =
        null == arrBookComment.book.genre?.id
          ? null
          : new Genre(arrBookComment.book.genre.description, arrBookComment.book.genre.id);
      book.idiom =
        null == arrBookComment.book.idiom?.id
          ? null
          : new Idiom(arrBookComment.book.idiom.description, arrBookComment.book.idiom.id);
      let person =
        null === arrBookComment.person
          ? null
          : new Person(
              arrBookComment.person.name,
              arrBookComment.person.email,
              arrBookComment.person.phone,
              arrBookComment.person.birth_date,
              arrBookComment.person.cpf,
              arrBookComment.person.address,
              arrBookComment.person.city,
              arrBookComment.person.state,
              arrBookComment.person.id_person
            );
      bookComment.person = person;
      bookComment.book = book;
    } else bookComment = new BookComment();

    return bookComment;
  }

  /**
   * Find all the book copy
   * @return Promise<BookCopy[]> a list of @BookCopy instances
   */
  public static async findAllFromBook(bookId: number): Promise<BookComment[]> {
    let allBookComments: BookComment[] = [];
    //1. execute sql
    const [rows] = await (
      await conn
    ).execute(
      "SELECT bc.id, bc.description, IF(1 = bc.vote, TRUE, FALSE) AS vote, IF(1 = bc.visible, TRUE, FALSE) AS visible, bc.person_id, pe.name as person_name, pe.email as person_email," +
        "pe.phone as person_phone, DATE_FORMAT(pe.birth_date, '%Y-%m-%d') as person_birth_date," +
        "pe.cpf as person_cpf, pe.address as person_address, pe.city as person_city, pe.state as person_state," +
        "b.id as book_id, b.name as book_name, b.volumn as book_volumn, b.number_pages as book_number_pages, b.edition as book_edition," +
        "b.release_year as book_release_year, b.author_obs as book_author_obs, b.obs as book_obs, b.isbn as book_isbn," +
        "b.publisher_id as book_publisher_id, p.name as book_publisher_name, p.country_id as book_publisher_country_id, c.name as book_publisher_country_name," +
        "c.fullName as book_publisher_country_fullName, c.short as book_publisher_country_short, c.flag as book_publisher_country_flag," +
        "b.style_id as book_style_id, s.description as book_style_description," +
        "b.genre_id as book_genre_id, g.description as book_genre_description," +
        "b.idiom_id as book_idiom_id, i.description as book_idiom_description " +
        "FROM book_comment bc " +
        "LEFT JOIN book b ON b.id = bc.book_id " +
        "LEFT JOIN publisher p ON p.id = b.publisher_id " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "LEFT JOIN style s ON s.id = b.style_id " +
        "LEFT JOIN genre g ON g.id = b.genre_id " +
        "LEFT JOIN idiom i ON i.id = b.idiom_id " +
        "LEFT JOIN person pe on pe.id = bc.person_id "+
        "WHERE bc.book_id = ?",
        [bookId]
    );
    /**
     * 2. for each book create a @BookComment instance
     */
    await Promise.all(
      Object.values(rows).map(async (el: BookCommentDataSQL) => {
        let arrBookComment: BookCommentDataInterfaces = this.generateBookCommentFromData(el);

        let book = new Book(
          arrBookComment.book.name,
          arrBookComment.book.volumn,
          arrBookComment.book.number_pages,
          arrBookComment.book.edition,
          arrBookComment.book.release_year,
          arrBookComment.book.author_obs,
          arrBookComment.book.obs,
          arrBookComment.book.isbn,
          arrBookComment.book.id
        );
        let authorsBook: Author[] = await AuthorModel.findAllAuthorsFromBook(arrBookComment.book.id);
        book.authors = authorsBook;
        book.publisher =
          null == arrBookComment.book.publisher?.id
            ? null
            : new Publisher(
                arrBookComment.book.publisher?.name,
                new Country(
                  arrBookComment.book.publisher?.country.name,
                  arrBookComment.book.publisher?.country.fullName,
                  arrBookComment.book.publisher?.country.short,
                  arrBookComment.book.publisher?.country.flag,
                  arrBookComment.book.publisher?.country.id
                ),
                arrBookComment.book.publisher?.id
              );
        book.style =
          null == arrBookComment.book.style?.id
            ? null
            : new Style(arrBookComment.book.style.description, arrBookComment.book.style.id);
        book.genre =
          null == arrBookComment.book.genre?.id
            ? null
            : new Genre(arrBookComment.book.genre.description, arrBookComment.book.genre.id);
        book.idiom =
          null == arrBookComment.book.idiom?.id
            ? null
            : new Idiom(arrBookComment.book.idiom.description, arrBookComment.book.idiom.id);

        let person =
          null === arrBookComment.person
            ? null
            : new Person(
                arrBookComment.person.name,
                arrBookComment.person.email,
                arrBookComment.person.phone,
                arrBookComment.person.birth_date,
                arrBookComment.person.cpf,
                arrBookComment.person.address,
                arrBookComment.person.city,
                arrBookComment.person.state,
                arrBookComment.person.id_person
              );
        //3. if book list is undefined return id = 0
        let bookComment = new BookComment(
          arrBookComment.description,
          arrBookComment.vote,
          arrBookComment.visible,
          arrBookComment.id
        );
        bookComment.person = person;
        bookComment.book = book;

        allBookComments.push(bookComment);
      })
    );

    return allBookComments;
  }
}
