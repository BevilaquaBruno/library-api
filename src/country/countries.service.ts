/**
 * Data Model Interfaces
 */
import { BaseCountry, Country } from "./country.interface";
import { Countries } from "./countries.interface";
/**
 * In-Memory Store
 */
let countries: Countries = {
  1: {
    id: 1,
    name: "Brasil",
    full_name: "República Federativa do Brasil",
    short: "BRA",
    flag: "brasil_flag.png"
  },
  2: {
    id: 2,
    name: "Estados Unidos",
    full_name: "Estados Unidos da América",
    short: "EUA",
    flag: "estados_unidos_flag.png"
  }
};

/**
 * Service Methods
 */

export const findAll = async (): Promise<Country[]> => Object.values(countries);

export const find = async (id: number): Promise<Country> => countries[id];

export const create = async (newCountry: BaseCountry): Promise<Country> => {
  const id = new Date().valueOf();

  countries[id] = {
    id,
    ...newCountry
  }

  return countries[id];
};

export const update = async (id: number, countryUpdate: BaseCountry): Promise<Country | null> => {
  const country = await find(id);

  if (!country) {
    return null;
  }

  countries[id] = { id, ...countryUpdate };

  return countries[id];
};

export const remove = async (id: number): Promise<null | void> => {
  const country = await find(id);

  if (!country) {
    return null;
  }

  delete countries[id];
};