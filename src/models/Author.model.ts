/**
 * Data Model Interfaces
 */
import Author from "../classes/Author.class";
import { AuthorData, AuthorDataSQL } from "../interfaces/Author.interface";
import DatabaseConnection from "../../db/db";
import { ResultSetHeader } from "mysql2";
import Country from "../classes/Country.class";

//get connection
const conn = DatabaseConnection.getConnection();

/**
 * Model class for author
 */
export default class AuthorModel {
  /**
   * return a @Author instance
   * @param authorData @AuthorData interface with data
   */
  private static generateAuthorFromData(authorDataSql: AuthorDataSQL): AuthorData {
    let authorData: AuthorData = {
      id: authorDataSql.id,
      name: authorDataSql.name,
      fullName: authorDataSql.fullName,
      birth_date: authorDataSql.birth_date,
      death_date: authorDataSql.death_date,
      born_place: authorDataSql.born_place,
      death_place: authorDataSql.death_place,
      born_country:
        null === authorDataSql.born_country_id
          ? null
          : new Country(
              authorDataSql.born_country_name || "",
              authorDataSql.born_country_fullName,
              authorDataSql.born_country_short || "",
              authorDataSql.born_country_flag,
              authorDataSql.born_country_id
            ),
      death_country:
        null === authorDataSql.death_country_id
          ? null
          : new Country(
              authorDataSql.death_country_name || "",
              authorDataSql.death_country_fullName,
              authorDataSql.death_country_short || "",
              authorDataSql.death_country_flag,
              authorDataSql.death_country_id
            ),
    };

    return authorData;
  }

  /**
   * Find a author with the given id
   * @param id - author's id - 1
   * @return Promise<Author> a @Author instance, if id is 0 the author does not exists
   */
  public static async findById(id: number): Promise<Author> {
    //1. execute sql with the id
    const [rows] = await (
      await conn
    ).execute(
      "SELECT a.id, a.name, a.fullName, a.birth_date, a.death_date, a.born_place, a.death_place, " +
        "a.born_country_id, cb.name AS born_country_name, cb.fullName AS born_country_fullName, cb.short AS born_country_short, cb.flag AS born_country_flag, " +
        "a.death_country_id, cd.name AS death_country_name, cd.fullName AS death_country_fullName, cd.short AS death_country_short, cd.flag AS death_country_flag " +
        "FROM author a " +
        "LEFT JOIN country cb ON cb.id = a.born_country_id " +
        "LEFT JOIN country cd ON cd.id = a.death_country_id " +
        "WHERE a.id = ?",
      [id.toString()]
    );
    //2. get data
    let author: Author;
    if (undefined !== Object.values(rows)[0]) {
      let arrAuthor: AuthorData = this.generateAuthorFromData(Object.values(rows)[0]);
      //3. if author list is undefined return id = 0
      author = new Author(
        arrAuthor.name,
        arrAuthor.fullName,
        arrAuthor.birth_date,
        arrAuthor.death_date,
        arrAuthor.born_place,
        arrAuthor.death_place,
        arrAuthor.born_country,
        arrAuthor.death_country,
        arrAuthor.id
      );
    } else author = new Author();

    return author;
  }

  /**
   * Find a author with the given name
   * @param id - author's id - 1
   * @param name - author's name - Machado de Assis
   * @return Promise<Author> a @Author instance, if id is 0 the author does not exists
   */
  public static async findByName(name: string, currentId = 0): Promise<Author> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql =
        "SELECT a.id, a.name, a.fullName, a.birth_date, a.death_date, a.born_place, a.death_place, " +
        "a.born_country_id, cb.name AS born_country_name, cb.fullName AS born_country_fullName, cb.short AS born_country_short, cb.flag AS born_country_flag, " +
        "a.death_country_id, cd.name AS death_country_name, cd.fullName AS death_country_fullName, cd.short AS death_country_short, cd.flag AS death_country_flag " +
        "FROM author a " +
        "LEFT JOIN country cb ON cb.id = a.born_country_id " +
        "LEFT JOIN country cd ON cd.id = a.death_country_id" +
        "WHERE a.name = ?";
      data = [name];
    } else {
      sql =
        "SELECT a.id, a.name, a.fullName, a.birth_date, a.death_date, a.born_place, a.death_place, " +
        "a.born_country_id, cb.name AS born_country_name, cb.fullName AS born_country_fullName, cb.short AS born_country_short, cb.flag AS born_country_flag, " +
        "a.death_country_id, cd.name AS death_country_name, cd.fullName AS death_country_fullName, cd.short AS death_country_short, cd.flag AS death_country_flag " +
        "FROM author a " +
        "LEFT JOIN country cb ON cb.id = a.born_country_id " +
        "LEFT JOIN country cd ON cd.id = a.death_country_id" +
        "WHERE a.name = ? AND a.id <> ?";
      data = [name, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let author: Author;

    if (undefined !== Object.values(rows)[0]) {
      let arrAuthor: AuthorData = this.generateAuthorFromData(Object.values(rows)[0]);

      author = new Author(
        arrAuthor.name,
        arrAuthor.fullName,
        arrAuthor.birth_date,
        arrAuthor.death_date,
        arrAuthor.born_place,
        arrAuthor.death_place,
        arrAuthor.born_country,
        arrAuthor.death_country,
        arrAuthor.id
      );
    } else author = new Author();

    return author;
  }

  /**
   * Find a author with the given fullName
   * @param id - author's id - 1
   * @param fullName - author's fullName - José Maria Machado de Assis
   * @return Promise<Author> a @Author instance, if id is 0 the author does not exists
   */
  public static async findByFullName(fullName: string, currentId = 0): Promise<Author> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql =
        "SELECT a.id, a.name, a.fullName, a.birth_date, a.death_date, a.born_place, a.death_place, " +
        "a.born_country_id, cb.name AS born_country_name, cb.fullName AS born_country_fullName, cb.short AS born_country_short, cb.flag AS born_country_flag, " +
        "a.death_country_id, cd.name AS death_country_name, cd.fullName AS death_country_fullName, cd.short AS death_country_short, cd.flag AS death_country_flag " +
        "FROM author a " +
        "LEFT JOIN country cb ON cb.id = a.born_country_id " +
        "LEFT JOIN country cd ON cd.id = a.death_country_id" +
        "WHERE a.fullName = ?";
      data = [fullName];
    } else {
      sql =
        "SELECT a.id, a.name, a.fullName, a.birth_date, a.death_date, a.born_place, a.death_place, " +
        "a.born_country_id, cb.name AS born_country_name, cb.fullName AS born_country_fullName, cb.short AS born_country_short, cb.flag AS born_country_flag, " +
        "a.death_country_id, cd.name AS death_country_name, cd.fullName AS death_country_fullName, cd.short AS death_country_short, cd.flag AS death_country_flag " +
        "FROM author a " +
        "LEFT JOIN country cb ON cb.id = a.born_country_id " +
        "LEFT JOIN country cd ON cd.id = a.death_country_id" +
        "WHERE a.name = ? AND a.id <> ?";
      data = [fullName, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let author: Author;

    if (undefined !== Object.values(rows)[0]) {
      let arrAuthor: AuthorData = this.generateAuthorFromData(Object.values(rows)[0]);

      author = new Author(
        arrAuthor.name,
        arrAuthor.fullName,
        arrAuthor.birth_date,
        arrAuthor.death_date,
        arrAuthor.born_place,
        arrAuthor.death_place,
        arrAuthor.born_country,
        arrAuthor.death_country,
        arrAuthor.id
      );
    } else author = new Author();

    return author;
  }

  /**
   * Find all the author's from the given book
   * @return Promise<Author[]> a list of @Author instances
   */
  public static async findAllAuthorsFromBook(bookId: number): Promise<Author[]> {
    let allAuthors: Author[] = [];
    //1. execute sql
    const [rows] = await (
      await conn
    ).execute(
      "SELECT a.id, a.name, a.fullName, a.birth_date, a.death_date, a.born_place, a.death_place, " +
        "a.born_country_id, cb.name AS born_country_name, cb.fullName AS born_country_fullName, cb.short AS born_country_short, cb.flag AS born_country_flag, " +
        "a.death_country_id, cd.name AS death_country_name, cd.fullName AS death_country_fullName, cd.short AS death_country_short, cd.flag AS death_country_flag " +
        "FROM author a " +
        "LEFT JOIN country cb ON cb.id = a.born_country_id " +
        "LEFT JOIN country cd ON cd.id = a.death_country_id " +
        "LEFT JOIN book_author ba on ba.author_id = a.id AND ba.book_id = ?",
      [bookId]
    );
    /**
     * 2. for each author create a @Author instance
     */
    Object.values(rows).map((el: AuthorDataSQL) =>
      allAuthors.push(
        new Author(
          el.name,
          el.fullName,
          el.birth_date,
          el.death_date,
          el.born_place,
          el.death_place,
          null === el.born_country_id
            ? null
            : new Country(
                el.born_country_name || "",
                el.born_country_fullName,
                el.born_country_short || "",
                el.born_country_flag,
                el.born_country_id
              ),
          null === el.death_country_id
            ? null
            : new Country(
                el.death_country_name || "",
                el.death_country_fullName,
                el.death_country_short || "",
                el.death_country_flag,
                el.death_country_id
              ),
          el.id
        )
      )
    );

    return allAuthors;
  }

  /**
   * Find all the author
   * @return Promise<Author[]> a list of @Author instances
   */
  public static async findAll(): Promise<Author[]> {
    let allAuthors: Author[] = [];
    //1. execute sql
    const [rows] = await (
      await conn
    ).execute(
      "SELECT a.id, a.name, a.fullName, a.birth_date, a.death_date, a.born_place, a.death_place, " +
        "a.born_country_id, cb.name AS born_country_name, cb.fullName AS born_country_fullName, cb.short AS born_country_short, cb.flag AS born_country_flag, " +
        "a.death_country_id, cd.name AS death_country_name, cd.fullName AS death_country_fullName, cd.short AS death_country_short, cd.flag AS death_country_flag " +
        "FROM author a " +
        "LEFT JOIN country cb ON cb.id = a.born_country_id " +
        "LEFT JOIN country cd ON cd.id = a.death_country_id"
    );
    /**
     * 2. for each author create a @Author instance
     */
    Object.values(rows).map((el: AuthorDataSQL) =>
      allAuthors.push(
        new Author(
          el.name,
          el.fullName,
          el.birth_date,
          el.death_date,
          el.born_place,
          el.death_place,
          null === el.born_country_id
            ? null
            : new Country(
                el.born_country_name || "",
                el.born_country_fullName,
                el.born_country_short || "",
                el.born_country_flag,
                el.born_country_id
              ),
          null === el.death_country_id
            ? null
            : new Country(
                el.death_country_name || "",
                el.death_country_fullName,
                el.death_country_short || "",
                el.death_country_flag,
                el.death_country_id
              ),
          el.id
        )
      )
    );

    return allAuthors;
  }

  /**
   * Create a author
   * @param author - the author to insert
   * @return Promise<number> the id of the inserted author, if id is 0 the author does not exists
   */
  public static async create(author: Author): Promise<number> {
    //1. execute sql
    console.log(author);

    const rst: ResultSetHeader | any = await (
      await conn
    ).execute(
      "INSERT INTO author(name, fullName, birth_date, death_date, born_place, death_place, born_country_id, death_country_id) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      [
        author.name,
        author.fullName,
        author.birth_date,
        author.death_date,
        author.born_place,
        author.death_place,
        undefined === author.born_country?.id ? null : author.born_country?.id,
        undefined === author.death_country?.id ? null : author.death_country?.id,
      ]
    );
    let id: number;
    //2. if returned id is undefined returns 0 for function else returns the id
    if (undefined !== rst[0].insertId) id = rst[0].insertId;
    else id = 0;

    return id;
  }

  /**
   * update a author
   * @param author - the author to update
   * @return Promise<boolean> true or false, updated or not
   */
  public static async update(author: Author): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute(
      "UPDATE author SET name = ?, fullName = ?, birth_date = ?, death_date = ?, born_place = ?, death_place = ?, born_country_id = ?, death_country_id = ? WHERE id = ?",
      [
        author.name,
        author.fullName,
        author.birth_date,
        author.death_date,
        author.born_place,
        author.death_place,
        undefined === author.born_country?.id ? null : author.born_country?.id,
        undefined === author.death_country?.id ? null : author.death_country?.id,
        author.id,
      ]
    );
    let cr: boolean;
    //2. if return id is undefined returns 0 for function, else returns the id
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }

  /**
   * delete a author
   * @param author - the author to delete
   * @return Promise<boolean> true or false, deleted or not
   */
  public static async delete(author: Author): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM author WHERE id = ?", [author.id]);
    let cr: boolean;
    //2. returns true or false based in sql result
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
