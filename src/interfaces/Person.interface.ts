/**
 * Interfaces for Person
 */

/**
 * @PersonData
 * Interface for person pattern data
 */
export interface PersonData {
  id_person: number;
  name: string;
  email: string;
  phone: string;
  birth_date: string | null;
  cpf: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
}
