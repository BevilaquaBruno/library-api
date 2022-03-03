/**
 * Data Model Interfaces
 */
import Publisher from "../classes/Publisher.class";
import { PublisherData } from "../interfaces/Publisher.interface";
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
   * @return Promise<Publisher> a @Publisher instance, if id is 0 the style does not exists
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
}
