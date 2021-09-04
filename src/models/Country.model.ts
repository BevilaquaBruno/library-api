/**
 * Data Model Interfaces
 */
import Country from '../classes/Country.class';
import { CountryData } from "../interfaces/Country.interface";
import DatabaseConnection from '../../db/db';
import { resolve } from 'path/posix';
import { ResultSetHeader } from 'mysql2';

var conn = DatabaseConnection.getConnection();

export default class CountryModel {
  public findAll = async (): Promise<Country[]> => {
    let allCountries: Country[] = [];
    const [ rows ] = await (await conn).execute("SELECT id, name, fullName, short, flag FROM country");
    Object.values(rows).map((el: CountryData) => allCountries.push(new Country(el.name, el.fullName, el.short, el.flag, el.id)));
    return allCountries;
  }

  public findById = async (id: number): Promise<Country> => {
    const [ rows ] = await (await conn).execute("SELECT id, name, fullName, short, flag FROM country WHERE id = ?",
    [id.toString()]);
    let arrCountry: CountryData = Object.values(rows)[0];
    let country: Country;
    if (undefined === arrCountry) {
      country = new Country();
    }else{
      country = new Country(arrCountry.name, arrCountry.fullName, arrCountry.short, arrCountry.flag, arrCountry.id);
    }
    return country;
  }

  public create = async (country: Country): Promise<number> => {
    const rst: ResultSetHeader | any = await (await conn).execute("INSERT INTO Country(name, fullName, short, flag) VALUES(?, ?, ?, ?)",
      [country.name, country.fullName, country.short, country.flag]);
      let id: number;
      if (undefined !== rst[0].insertId)
        id = rst[0].insertId
      else
        id = 0;
      return id;
  }

  public update = async (country: Country): Promise<boolean> => {
    const rst: ResultSetHeader | any = await (await conn).execute("UPDATE Country set name = ?, fullName = ?, short = ?, flag = ? WHERE id = ?",
    [ country.name, country.fullName, country.short, country.flag, country.id.toString()]);
    let cr: boolean;
    if (undefined !== rst[0].affectedRows)
      cr = true;
    else
      cr = false;
    return cr;
  }

  public remove = async (country: Country): Promise<boolean> => {
    const rst: ResultSetHeader | any = await (await conn).execute("DELETE FROM Country WHERE id = ?",
    [country.id.toString()]);
    let cr: boolean;
    if (undefined !== rst[0].affectedRows)
      cr = true;
    else
      cr = false;
    return cr;
  }
}