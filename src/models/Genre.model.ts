/**
 * Data Model Interfaces
 */
import Genre from "../classes/Genre.class";
import { GenreData } from "../interfaces/Genre.interface";
import DatabaseConnection from "../../db/db";
import { ResultSetHeader } from "mysql2";

//get connection
const conn = DatabaseConnection.getConnection();

/**
 * Model class for genre
 */
export default class GenreModel {
  /**
   * Find a genre with the given id
   * @param id - genre's id - 1
   * @return Promise<Genre> a @Genre instance, if id is 0 the genre does not exists
   */
  public static async findById(id: number): Promise<Genre> {
    //1. execute sql with the id
    const [rows] = await (
      await conn
    ).execute("SELECT id, description FROM genre WHERE id = ?", [id.toString()]);
    //2. get data
    let arrGenre: GenreData = Object.values(rows)[0];
    let genre: Genre;
    //3. if genre list is undefined return id = 0
    if (undefined === arrGenre) genre = new Genre();
    else genre = new Genre(arrGenre.description, arrGenre.id);

    return genre;
  }

  /**
   * Find a genre with the given description
   * @param id - genre's id - 1
   * @return Promise<Genre> a @Genre instance, if id is 0 the genre does not exists
   */
  public static async findByDescription(
    description: string,
    currentId = 0
  ): Promise<Genre> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql = "SELECT id, description FROM genre WHERE description = ?";
      data = [description];
    } else {
      sql = "SELECT id, description FROM genre WHERE description = ? AND id <> ?";
      data = [description, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let arrGenre: GenreData = Object.values(rows)[0];
    let genre: Genre;
    //3. if genre list is undefined returns a genre with id  = 0 else returns the genre
    if (undefined === arrGenre) genre = new Genre();
    else genre = new Genre(arrGenre.description, arrGenre.id);

    return genre;
  }

  /**
   * Find all the genres
   * @return Promise<Genre[]> a list of @Genre instances
   */
  public static async findAll(): Promise<Genre[]> {
    let allGenres: Genre[] = [];
    //1. execute sql
    const [rows] = await (await conn).execute("SELECT id, description FROM genre");
    /**
     * 2. for each genre create a @Genre instance
     */
    Object.values(rows).map((el: GenreData) => allGenres.push(new Genre(el.description, el.id)));

    return allGenres;
  }

  /**
   * Create a genre
   * @param genre - the genre to insert
   * @return Promise<number> the id of the inserted genre, if id is 0 the genre does not exists
   */
  public static async create(genre: Genre): Promise<number> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("INSERT INTO genre(description) VALUES(?)", [genre.description]);
    let id: number;
    //2. if returned id is undefined returns 0 for function else returns the id
    if (undefined !== rst[0].insertId) id = rst[0].insertId;
    else id = 0;

    return id;
  }

  /**
   * update a genre
   * @param genre - the genre to update
   * @return Promise<boolean> true or false, updated or not
   */
  public static async update(genre: Genre): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("UPDATE genre SET description = ? WHERE id = ?", [
      genre.description,
      genre.id.toString(),
    ]);
    let cr: boolean;
    //2. if return id is undefined returns 0 for function, else returns the id
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }

  /**
   * delete a genre
   * @param genre - the genre to delete
   * @return Promise<boolean> true or false, deleted or not
   */
  public static async delete(genre: Genre): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM genre WHERE id = ?", [genre.id.toString()]);
    let cr: boolean;
    //2. returns true or false based in sql result
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
