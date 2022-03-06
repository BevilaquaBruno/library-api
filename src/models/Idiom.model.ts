/**
 * Data Model Interfaces
 */
import Idiom from "../classes/Idiom.class";
import { IdiomData } from "../interfaces/Idiom.interface";
import DatabaseConnection from "../../db/db";
import { ResultSetHeader } from "mysql2";

//get connection
const conn = DatabaseConnection.getConnection();

/**
 * Model class for idiom
 */
export default class IdiomModel {
  /**
   * Find a idiom with the given id
   * @param id - idiom's id - 1
   * @return Promise<Idiom> a @Idiom instance, if id is 0 the idiom does not exists
   */
  public static async findById(id: number): Promise<Idiom> {
    //1. execute sql with the id
    const [rows] = await (
      await conn
    ).execute("SELECT id, description FROM idiom WHERE id = ?", [id.toString()]);
    //2. get data
    let arrIdiom: IdiomData = Object.values(rows)[0];
    let idiom: Idiom;
    //3. if idiom list is undefined return id = 0
    if (undefined === arrIdiom) idiom = new Idiom();
    else idiom = new Idiom(arrIdiom.description, arrIdiom.id);

    return idiom;
  }

  /**
   * Find a idiom with the given description
   * @param id - idiom's id - 1
   * @return Promise<Idiom> a @Idiom instance, if id is 0 the idiom does not exists
   */
  public static async findByDescription(
    description: string,
    currentId: number = 0
  ): Promise<Idiom> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql = "SELECT id, description FROM idiom WHERE description = ?";
      data = [description];
    } else {
      sql = "SELECT id, description FROM idiom WHERE description = ? AND id <> ?";
      data = [description, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let arrIdiom: IdiomData = Object.values(rows)[0];
    let idiom: Idiom;
    //3. if idiom list is undefined returns a idiom with id  = 0 else returns the idiom
    if (undefined === arrIdiom) idiom = new Idiom();
    else idiom = new Idiom(arrIdiom.description, arrIdiom.id);

    return idiom;
  }

  /**
   * Find all the idioms
   * @return Promise<Idiom[]> a list of @Idiom instances
   */
  public static async findAll(): Promise<Idiom[]> {
    let allIdioms: Idiom[] = [];
    //1. execute sql
    const [rows] = await (await conn).execute("SELECT id, description FROM idiom");
    /**
     * 2. for each idiom create a @Idiom instance
     */
    Object.values(rows).map((el: IdiomData) => allIdioms.push(new Idiom(el.description, el.id)));

    return allIdioms;
  }

  /**
   * Create a idiom
   * @param idiom - the idiom to insert
   * @return Promise<number> the id of the inserted idiom, if id is 0 the idiom does not exists
   */
  public static async create(idiom: Idiom): Promise<number> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("INSERT INTO idiom(description) VALUES(?)", [idiom.description]);
    let id: number;
    //2. if returned id is undefined returns 0 for function else returns the id
    if (undefined !== rst[0].insertId) id = rst[0].insertId;
    else id = 0;

    return id;
  }

  /**
   * update a idiom
   * @param idiom - the idiom to update
   * @return Promise<boolean> true or false, updated or not
   */
  public static async update(idiom: Idiom): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("UPDATE idiom SET description = ? WHERE id = ?", [
      idiom.description,
      idiom.id.toString(),
    ]);
    let cr: boolean;
    //2. if return id is undefined returns 0 for function, else returns the id
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }

  /**
   * delete a idiom
   * @param idiom - the idiom to delete
   * @return Promise<boolean> true or false, deleted or not
   */
  public static async delete(idiom: Idiom): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM idiom WHERE id = ?", [idiom.id.toString()]);
    let cr: boolean;
    //2. returns true or false based in sql result
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
