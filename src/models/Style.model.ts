/**
 * Data Model Interfaces
 */
import Style from "../classes/Style.class";
import { StyleData } from "../interfaces/Style.interface";
import DatabaseConnection from "../../db/db";
import { ResultSetHeader } from "mysql2";

//get connection
const conn = DatabaseConnection.getConnection();

/**
 * Model class for style
 */
export default class StyleModel {
  /**
   * Find a style with the given id
   * @param id - style's id - 1
   * @return Promise<Style> a @Style instance, if id is 0 the style does not exists
   */
  public static async findById(id: number): Promise<Style> {
    //1. execute sql with the id
    const [rows] = await (
      await conn
    ).execute("SELECT id, description FROM style WHERE id = ?", [id.toString()]);
    //2. get data
    let arrStyle: StyleData = Object.values(rows)[0];
    let style: Style;
    //3. if style list is undefined return id = 0
    if (undefined === arrStyle) style = new Style();
    else style = new Style(arrStyle.description, arrStyle.id);

    return style;
  }

  /**
   * Find a style with the given description
   * @param id - style's id - 1
   * @return Promise<Style> a @Style instance, if id is 0 the style does not exists
   */
  public static async findByDescription(
    description: string,
    currentId = 0
  ): Promise<Style> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql = "SELECT id, description FROM style WHERE description = ?";
      data = [description];
    } else {
      sql = "SELECT id, description FROM style WHERE description = ? AND id <> ?";
      data = [description, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let arrStyle: StyleData = Object.values(rows)[0];
    let style: Style;
    //3. if style list is undefined returns a style with id  = 0 else returns the style
    if (undefined === arrStyle) style = new Style();
    else style = new Style(arrStyle.description, arrStyle.id);

    return style;
  }

  /**
   * Find all the styles
   * @return Promise<Style[]> a list of @Style instances
   */
  public static async findAll(): Promise<Style[]> {
    let allStyles: Style[] = [];
    //1. execute sql
    const [rows] = await (await conn).execute("SELECT id, description FROM style");
    /**
     * 2. for each style create a @Style instance
     */
    Object.values(rows).map((el: StyleData) => allStyles.push(new Style(el.description, el.id)));

    return allStyles;
  }

  /**
   * Create a style
   * @param style - the style to insert
   * @return Promise<number> the id of the inserted style, if id is 0 the style does not exists
   */
  public static async create(style: Style): Promise<number> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("INSERT INTO style(description) VALUES(?)", [style.description]);
    let id: number;
    //2. if returned id is undefined returns 0 for function else returns the id
    if (undefined !== rst[0].insertId) id = rst[0].insertId;
    else id = 0;

    return id;
  }

  /**
   * update a style
   * @param style - the style to update
   * @return Promise<boolean> true or false, updated or not
   */
  public static async update(style: Style): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("UPDATE style SET description = ? WHERE id = ?", [
      style.description,
      style.id.toString(),
    ]);
    let cr: boolean;
    //2. if return id is undefined returns 0 for function, else returns the id
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }

  /**
   * delete a style
   * @param style - the style to delete
   * @return Promise<boolean> true or false, deleted or not
   */
  public static async delete(style: Style): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM style WHERE id = ?", [style.id.toString()]);
    let cr: boolean;
    //2. returns true or false based in sql result
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
