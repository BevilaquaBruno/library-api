import Book from "../classes/Book.class";
import Person from "../classes/Person.class";

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
  receiver_person: Person;
  book: Book;
  photo: string | null;
}
