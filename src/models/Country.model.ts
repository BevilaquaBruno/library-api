/**
 * Data Model Interfaces
 */
import Country from '../classes/Country.class';
import { CountryList, CountryData } from "../interfaces/Country.interface";
import DatabaseConnection from '../../db/db';

var conn = DatabaseConnection.getConnection();
/**
 * In-Memory Store
 */
let countries: CountryList = {
  1: new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
  2: new Country("Estados Unidos", "Estados Unidos da América", "EUA", "estados_unidos_flag.png", 2)
};

export default class CountryModel {
  public findAll = async (): Promise<Country[]> => {
    let allCountries: Country[] = [];
    const [ rows ] = await (await conn).execute("SELECT id, name, fullName, short, flag FROM country");
    Object.values(rows).map((el: CountryData) => allCountries.push(new Country(el.name, el.fullName, el.short, el.flag, el.id)));
    return allCountries;
  }

  public find = async (id: number): Promise<Country | boolean> => {
    const [ rows ] = await (await conn).execute("SELECT id, name, fullName, short, flag FROM country WHERE id = ?",
    [id.toString()]);
    let arrCountry: CountryData = Object.values(rows)[0];
    let country: Country = new Country(arrCountry.name, arrCountry.fullName, arrCountry.short, arrCountry.flag, arrCountry.id);
    return country;
  }

  public create = async (newCountry: Country): Promise<Country> => {
    const newId: number = new Date().valueOf();
    newCountry.id = newId;
    countries[newId] = newCountry;
    return countries[newId];
  }

  public update = async (countryUpdate: Country): Promise<Country | null> => {
    const country = await this.find(countryUpdate.id);
    if (!country) {
      return null;
    }
    countries[countryUpdate.id] = countryUpdate;
    return countries[countryUpdate.id];
  }

  public remove = async (country: Country): Promise<null | void> => {
    const deletedCountry = await this.find(country.id);
    if (!deletedCountry) {
      return null;
    }
    delete countries[country.id];
  }
}