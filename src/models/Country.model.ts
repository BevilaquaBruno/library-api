/**
 * Data Model Interfaces
 */
import Country from "../classes/Country.class";
import { CountryData } from "../interfaces/Country.interface";
import DatabaseConnection from "../../db/db";
import { ResultSetHeader } from "mysql2";
import Helper from "../classes/Helper.class";

// get connection
const conn = DatabaseConnection.getConnection();

/**
 * model class for country
 */
export default class CountryModel {

  /**
   * Find a country with the given short
   * @param short - country's short - BRA
   * @param currentId - the id who you don't know to consider - 1
   * @return Promise<Country> a @Country instance, if id is 0 the country does not exists
   */
  public static async findByShort(short: string, currentId: number = 0): Promise<Country> {
    let sql: string;
    let data: string[];
    if (0 === currentId) {
      sql = "SELECT id, name, fullName, short, flag FROM country WHERE short = ?";
      data = [short];
    } else {
      sql = "SELECT id, name, fullName, short, flag FROM country WHERE short = ? AND id <> ?";
      data = [short, currentId.toString()];
    }
    const [rows] = await (await conn).execute(sql, data);
    let arrCountry: CountryData = Object.values(rows)[0];
    let country: Country;
    if (undefined === arrCountry) country = new Country();
    else
      country = new Country(
        arrCountry.name,
        arrCountry.fullName,
        arrCountry.short,
        arrCountry.flag,
        arrCountry.id
      );

    return country;
  }

  /**
   * Find a country with the given full name
   * @param fullName - country's full name - República Federativa do Brasil
   * @param currentId - the id who you don't know to consider - 1
   * @return Promise<Country> a @Country instance, if id is 0 the country does not exists
   */
  public static async findByFullName(fullName: string, currentId: number = 0): Promise<Country> {
    let sql: string;
    let data: string[];
    if (0 === currentId) {
      sql = "SELECT id, name, fullName, short, flag FROM country WHERE fullName = ?";
      data = [fullName];
    } else {
      sql = "SELECT id, name, fullName, short, flag FROM country WHERE fullName = ? and id <> ?";
      data = [fullName, currentId.toString()];
    }
    const [rows] = await (await conn).execute(sql, data);
    let arrCountry: CountryData = Object.values(rows)[0];
    let country: Country;
    if (undefined === arrCountry) country = new Country();
    else
      country = new Country(
        arrCountry.name,
        arrCountry.fullName,
        arrCountry.short,
        arrCountry.flag,
        arrCountry.id
      );

    return country;
  }

  /**
   * Find a country with the given name
   * @param name - country's name - Brasil
   * @param currentId - the id who you don't know to consider - 1
   * @return Promise<Country> a @Country instance, if id is 0 the country does not exists
   */
  public static async findByName(name: string, currentId: number = 0): Promise<Country> {
    let sql: string;
    let data: string[];
    if (0 === currentId) {
      sql = "SELECT id, name, fullName, short, flag FROM country WHERE name = ?";
      data = [name];
    } else {
      sql = "SELECT id, name, fullName, short, flag FROM country WHERE name = ? AND id <> ?";
      data = [name, currentId.toString()];
    }
    const [rows] = await (await conn).execute(sql, data);
    let arrCountry: CountryData = Object.values(rows)[0];
    let country: Country;
    if (undefined === arrCountry) country = new Country();
    else
      country = new Country(
        arrCountry.name,
        arrCountry.fullName,
        arrCountry.short,
        arrCountry.flag,
        arrCountry.id
      );

    return country;
  }

  /**
   * Find a country with the given id
   * @param id - country's id - 1
   * @return Promise<Country> a @Country instance, if id is 0 the country does not exists
   */
  public static async findById(id: number): Promise<Country> {
    const [rows] = await (
      await conn
    ).execute("SELECT id, name, fullName, short, flag FROM country WHERE id = ?", [id.toString()]);
    let arrCountry: CountryData = Object.values(rows)[0];
    let country: Country;
    if (undefined === arrCountry) country = new Country();
    else
      country = new Country(
        arrCountry.name,
        arrCountry.fullName,
        arrCountry.short,
        arrCountry.flag,
        arrCountry.id
      );

    return country;
  }

  /**
   * Find all the countries
   * @return Promise<Country[]> a list of @Country instances
   */
  public static async findAll(): Promise<Country[]> {
    let allCountries: Country[] = [];
    const [rows] = await (
      await conn
    ).execute("SELECT id, name, fullName, short, flag FROM country");
    Object.values(rows).map((el: CountryData) =>
      allCountries.push(new Country(el.name, el.fullName, el.short, el.flag, el.id))
    );

    return allCountries;
  }

  /**
   * Create a country
   * @param country - the country to insert
   * @return Promise<number> the id of the inserted country, if id is 0 the country does not exists
   */
  public static async create(country: Country): Promise<number> {
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("INSERT INTO country(name, fullName, short, flag) VALUES(?, ?, ?, ?)", [
      country.name,
      Helper.nullForEmpty(country.fullName),
      country.short,
      Helper.nullForEmpty(country.flag),
    ]);
    let id: number;
    if (undefined !== rst[0].insertId) id = rst[0].insertId;
    else id = 0;

    return id;
  }

  /**
   * update a country
   * @param country - the country to update
   * @return Promise<boolean> true or false, updated or not
   */
  public static async update(country: Country): Promise<boolean> {
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("UPDATE country SET name = ?, fullName = ?, short = ?, flag = ? WHERE id = ?", [
      country.name,
      Helper.nullForEmpty(country.fullName),
      country.short,
      Helper.nullForEmpty(country.flag),
      country.id.toString(),
    ]);
    let cr: boolean;
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }

  /**
   * delete a country
   * @param country - the country to delete
   * @return Promise<boolean> true or false, deleted or not
   */
  public static async delete(country: Country): Promise<boolean> {
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM country WHERE id = ?", [country.id.toString()]);
    let cr: boolean;
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
