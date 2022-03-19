import Author from "../classes/Author.class";
import Publisher from "../classes/Publisher.class";
import { AuthorData, AuthorDataInterfaces } from "./Author.interface";

/**
 * Interfaces for book
 *
 * @BookData
 * Interface for book pattern data
 */
export interface BookData {
  id: number;
  name: string;
  volumn: number | null;
  number_pages: number | null;
  edition: number | null;
  release_year: number | null;
  author_obs: string | null;
  obs: string | null;
  isbn: string | null;
  publisher: Publisher | null;
  authors: Author[] | null;
}

/**
 * @BookDataInterfaces
 * Interface for final json
 */
export interface BookDataInterfaces {
  id: number;
  name: string;
  volumn: number | null;
  number_pages: number | null;
  edition: number | null;
  release_year: number | null;
  author_obs: string | null;
  obs: string | null;
  isbn: string | null;
  publisher: Publisher | null;
  authors: AuthorDataInterfaces[] | null;
}

/**
 * @BookDataSQL
 * Interface for sql queries with author table
 */

export interface BookDataSQL {
  id: number;
  name: string;
  volumn: number | null;
  number_pages: number | null;
  edition: number | null;
  release_year: number | null;
  author_obs: string | null;
  obs: string | null;
  isbn: string | null;
  publisher_id: number;
  publisher_name: string;
  publisher_country_id: number;
  publisher_country_name: string;
  publisher_country_fullName: string;
  publisher_country_short: string;
  publisher_country_flag: string;
}
