import { BookData, BookDataInterfaces } from "./Book.interface";
import { PersonData } from "./Person.interface";

/**
 * Interfaces for book comment
 *
 * @BookCommentData
 * Interface for book comment pattern data
 */
export interface BookCommentData {
  id: number;
  description: string;
  vote: boolean;
  visible: boolean;
  book: BookData;
  person: PersonData | null;
}

export interface BookCommentDataInterfaces {
  id: number;
  description: string;
  vote: boolean;
  visible: boolean;
  person: PersonData | null;
  book: BookDataInterfaces;
}

export interface BookCommentDataInterfacesNoBook {
  id: number;
  description: string;
  vote: boolean;
  visible: boolean;
  person: PersonData | null;
}

/**
 * Interface for BookCommentDataSql
 * Used in sql for book comment
 */
export interface BookCommentDataSQL {
  id: number;
  description: string;
  vote: boolean;
  visible: boolean;
  person_id: number | null;
  person_name: string | null;
  person_email: string | null;
  person_phone: string | null;
  person_birth_date: string | null;
  person_cpf: string | null;
  person_address: string | null;
  person_city: string | null;
  person_state: string | null;
  book_id: number;
  book_name: string;
  book_volumn: number | null;
  book_number_pages: number | null;
  book_edition: number | null;
  book_release_year: number | null;
  book_author_obs: string | null;
  book_obs: string | null;
  book_isbn: string | null;
  book_publisher_id: number;
  book_publisher_name: string;
  book_publisher_country_id: number;
  book_publisher_country_name: string;
  book_publisher_country_fullName: string;
  book_publisher_country_short: string;
  book_publisher_country_flag: string;
  book_style_id: number;
  book_style_description: string;
  book_genre_id: number;
  book_genre_description: string;
  book_idiom_id: number;
  book_idiom_description: string;
}
