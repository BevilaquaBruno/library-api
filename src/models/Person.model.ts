/**
 * Data model for Person
 */
import DatabaseConnection from "../../db/db";
import Person from "../classes/Person.class";
import { PersonData } from "../interfaces/Person.interface";

const conn = DatabaseConnection.getConnection();

export default class PersonModel {
  public static async findAll(): Promise<Person[]> {
    let allPeople: Person[] = [];
    const [rows] = await (
      await conn
    ).execute("SELECT id, name, email, phone, DATE_FORMAT(birth_date, \"%Y-%m-%d\") as birth_date, cpf, address, city, state FROM person");
    Object.values(rows).map((el: PersonData) => {
      allPeople.push(
        new Person(
          el.name,
          el.email,
          el.phone,
          el.birth_date,
          el.cpf,
          el.address,
          el.city,
          el.state,
          el.id
        )
      );
    });

    return allPeople;
  }
}
