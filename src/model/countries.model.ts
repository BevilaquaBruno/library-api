/**
 * Data Model Interfaces
 */
import Country from '../classes/Country.class';
interface Countries {
  [key: number]: Country;
}


/**
 * In-Memory Store
 */
let countries: Countries = {
  1: new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
  2: new Country("Estados Unidos", "Estados Unidos da América", "EUA", "estados_unidos_flag.png", 2)
};

export default class CountryModel {
  public findAll = async (): Promise<Country[]> => {
    let allCountries: Country[] = Object.values(countries);
    return allCountries;
  }

  public find = async (id: number): Promise<Country> => {
    let arr = countries[id];
    let country = new Country(arr.name, arr.fullName, arr.short, arr.flag, id);
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