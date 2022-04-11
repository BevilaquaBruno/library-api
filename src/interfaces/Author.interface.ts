import Country from "../classes/Country.class";
import { CountryData } from "./Country.interface";

/**
 * Interfaces for author
 *
 * @AuthorData
 * Interface for book pattern data
 */
export interface AuthorData {
  id: number;
  name: string;
  fullName: string | null;
  birth_date: string | null;
  death_date: string | null;
  born_place: string | null;
  death_place: string | null;
  born_country: Country | null;
  death_country: Country | null;
}

/**
 * @AuthorDataInterfaces
 * Interface for final json
 */
export interface AuthorDataInterfaces {
  id: number;
  name: string;
  fullName: string | null;
  birth_date: string | null;
  death_date: string | null;
  born_place: string | null;
  death_place: string | null;
  born_country: CountryData | null;
  death_country: CountryData | null;
}

/**
 * @AuthorDataSQL
 * Interface for sql queries with author table
 */

export interface AuthorDataSQL {
  id: number;
  name: string;
  fullName: string | null;
  birth_date: string | null;
  death_date: string | null;
  born_place: string | null;
  death_place: string | null;
  born_country_id: number | null;
  born_country_name: string | null;
  born_country_fullName: string | null;
  born_country_short: string | null;
  born_country_flag: string | null;
  death_country_id: number | null;
  death_country_name: string | null;
  death_country_fullName: string | null;
  death_country_short: string | null;
  death_country_flag: string | null;
}
