import Author from "../classes/Author.class";
import Genre from "../classes/Genre.class";
import Idiom from "../classes/Idiom.class";
import Publisher from "../classes/Publisher.class";
import Style from "../classes/Style.class";
import { AuthorData, AuthorDataInterfaces } from "./Author.interface";
import { GenreData } from "./Genre.interface";
import { IdiomData } from "./Idiom.interface";
import { PublisherDataInterfaces } from "./Publisher.interface";
import { StyleData } from "./Style.interface";

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
  style: Style | null;
  genre: Genre | null;
  idiom: Idiom | null;
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
  publisher: PublisherDataInterfaces | null;
  style: StyleData | null;
  genre: GenreData | null;
  idiom: IdiomData | null;
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
  style_id: number;
  style_description: string;
  genre_id: number;
  genre_description: string;
  idiom_id: number;
  idiom_description: string;
}
