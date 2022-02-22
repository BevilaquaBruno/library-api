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
  fullName: string | null;
  birth_date: string | null;
  death_date: string | null;
  born_date: string | null;
  born_place: string | null;
  death_place: string | null;
  born_country: Country | null;
  death_country: Country | null;
}
