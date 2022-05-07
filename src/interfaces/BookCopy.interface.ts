import { BookData, BookDataInterfaces } from "./Book.interface";
import { PersonData } from "./Person.interface";

/**
 * Interfaces for book copy
 *
 * @BookCopyData
 * Interface for book copy pattern data
 */
export interface BookCopyData {
  id: number;
  description: string;
  buy_or_gift: string;
  buy_or_gift_date: string | null;
  obs: string | null;
  photo: string | null;
  receiver_person: PersonData;
  book: BookData;
}

export interface BookCopyDataInterfaces {
  id: number;
  description: string;
  buy_or_gift: string;
  buy_or_gift_date: string | null;
  obs: string | null;
  photo: string | null;
  receiver_person: PersonData;
  book: BookDataInterfaces;
}

/**
 * Interface for BookCopyDataSql
 * Used in sql for cook copy
 */
export interface BookCopyDataSQL {
  id: number;
  description: string;
  buy_or_gift: string;
  buy_or_gift_date: string;
  obs: string;
  photo: string;
  receiver_person_id: number;
  receiver_person_name: string;
  receiver_person_email: string;
  receiver_person_phone: string;
  receiver_person_birth_date: string;
  receiver_person_cpf: string;
  receiver_person_address: string;
  receiver_person_city: string;
  receiver_person_state: string;
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
