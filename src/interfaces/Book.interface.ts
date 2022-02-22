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
  volumn: number | null;
  number_pages: number | null;
  edition: number | null;
  release_year: number | null;
  author_obs: string | null;
  obs: string | null;
  isbn: string | null;
  publisher: Publisher | null;
}
