import Country from "../classes/Country.class";

/**
 * Interfaces for author
 *
 * @AuthorData
 * Interface for book pattern data
 */
export interface AuthorData {
  id: number;
  name: string;
  fullName: string;
  birth_date: string;
  death_date: string;
  born_date: string;
  born_place: string;
  death_place: string;
  born_country: Country;
  death_country: Country;
}
