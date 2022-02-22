import Publisher from "../classes/Publisher.class";

/**
 * Interfaces for book
 *
 * @BookData
 * Interface for book pattern data
 */
export interface BookData {
  id: number;
  name: string;
  volumn: number;
  number_pages: number;
  edition: number;
  release_year: number;
  author_obs: string;
  obs: string;
  isbn: string;
  publisher: Publisher;
}