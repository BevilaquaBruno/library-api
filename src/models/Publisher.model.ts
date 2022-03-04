/**
 * Data Model Interfaces
 */
import Publisher from "../classes/Publisher.class";
import { PublisherData, PublisherDataSQL } from "../interfaces/Publisher.interface";
import DatabaseConnection from "../../db/db";
import { ResultSetHeader } from "mysql2";
import Country from "../classes/Country.class";

//get connection
const conn = DatabaseConnection.getConnection();

/**
 * Model class for publisher
 */
export default class PublisherModel {
  /**
   * Find a publisher with the given id
   * @param id - publisher's id - 1
   * @return Promise<Publisher> a @Publisher instance, if id is 0 the publisher does not exists
   */
  public static async findById(id: number): Promise<Publisher> {
    //1. execute sql with the id
    const [rows] = await (
      await conn
    ).execute(
      "SELECT p.id, p.name, p.country_id, c.name AS country_name, c.fullName as country_fullName, c.short as country_short, c.flag as country_flag " +
        "FROM publisher p " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "WHERE p.id = ?",
      [id.toString()]
    );
    //2. get data
    let arrPublisher: PublisherData = {
      id: Object.values(rows)[0].id,
      name: Object.values(rows)[0].name,
      country: new Country(
        Object.values(rows)[0].country_name,
        Object.values(rows)[0].country_fullName,
        Object.values(rows)[0].country_short,
        Object.values(rows)[0].country_flag,
        Object.values(rows)[0].country_id
      ),
    };
    let publisher: Publisher;
    //3. if publisher list is undefined return id = 0
    if (undefined === arrPublisher) publisher = new Publisher();
    else publisher = new Publisher(arrPublisher.name, arrPublisher.country, arrPublisher.id);

    return publisher;
  }

  /**
   * Find a publisher with the given name
   * @param id - publisher's id - 1
   * @return Promise<Publisher> a @Publisher instance, if id is 0 the publisher does not exists
   */
  public static async findByName(name: string, currentId: number = 0): Promise<Publisher> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql =
        "SELECT p.id, p.name, p.country_id, c.name AS country_name, c.fullName as country_fullName, c.short as country_short, c.flag as country_flag " +
        "FROM publisher p " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "WHERE p.name = ?";
      data = [name];
    } else {
      sql =
        "SELECT p.id, p.name, p.country_id, c.name AS country_name, c.fullName as country_fullName, c.short as country_short, c.flag as country_flag " +
        "FROM publisher p " +
        "LEFT JOIN country c ON c.id = p.country_id " +
        "WHERE p.id = ? AND p.id <> ?";
      data = [name, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let arrPublisher: PublisherData = {
      id: Object.values(rows)[0].id,
      name: Object.values(rows)[0].name,
      country: new Country(
        Object.values(rows)[0].country_name,
        Object.values(rows)[0].country_fullName,
        Object.values(rows)[0].country_short,
        Object.values(rows)[0].country_flag,
        Object.values(rows)[0].country_id
      ),
    };
    let publisher: Publisher;
    //3. if publisher list is undefined returns a publisher with id  = 0 else returns the publisher
    if (undefined === arrPublisher) publisher = new Publisher();
    else publisher = new Publisher(arrPublisher.name, arrPublisher.country, arrPublisher.id);

    return publisher;
  }

  /**
   * Find all the publisher
   * @return Promise<Publisher[]> a list of @Publisher instances
   */
  public static async findAll(): Promise<Publisher[]> {
    let allPublishers: Publisher[] = [];
    //1. execute sql
    const [rows] = await (
      await conn
    ).execute(
      "SELECT p.id, p.name, p.country_id, c.name AS country_name, c.fullName as country_fullName, c.short as country_short, c.flag as country_flag " +
        "FROM publisher p " +
        "LEFT JOIN country c ON c.id = p.country_id "
    );
    /**
     * 2. for each publisher create a @Publisher instance
     */
    Object.values(rows).map((el: PublisherDataSQL) =>
      allPublishers.push(
        new Publisher(
          el.name,
          new Country(
            el.country_name,
            el.country_fullName,
            el.country_short,
            el.country_flag,
            el.country_id
          ),
          el.id
        )
      )
    );

    return allPublishers;
  }

  /**
   * Create a publisher
   * @param publisher - the publisher to insert
   * @return Promise<number> the id of the inserted publisher, if id is 0 the publisher does not exists
   */
  public static async create(publisher: Publisher): Promise<number> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("INSERT INTO publisher(name, country_id) VALUES(?, ?)", [
      publisher.name,
      publisher.country.id,
    ]);
    let id: number;
    //2. if returned id is undefined returns 0 for function else returns the id
    if (undefined !== rst[0].insertId) id = rst[0].insertId;
    else id = 0;

    return id;
  }

  /**
   * update a publisher
   * @param publisher - the publisher to update
   * @return Promise<boolean> true or false, updated or not
   */
  public static async update(publisher: Publisher): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("UPDATE publisher SET name = ?, country_id = ? WHERE id = ?", [
      publisher.name,
      publisher.country.id.toString(),
      publisher.id.toString(),
    ]);
    let cr: boolean;
    //2. if return id is undefined returns 0 for function, else returns the id
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }

  /**
   * delete a publisher
   * @param publisher - the publisher to delete
   * @return Promise<boolean> true or false, deleted or not
   */
  public static async delete(publisher: Publisher): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM publisher WHERE id = ?", [publisher.id.toString()]);
    let cr: boolean;
    //2. returns true or false based in sql result
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
