/**
 * Data model for Person
 */
import { ResultSetHeader } from "mysql2";
import DatabaseConnection from "../../db/db";
import Helper from "../classes/Helper.class";
import Person from "../classes/Person.class";
import { PersonData } from "../interfaces/Person.interface";

const conn = DatabaseConnection.getConnection();

export default class PersonModel {
  public static async findAll(): Promise<Person[]> {
    let allPeople: Person[] = [];
    const [rows] = await (
      await conn
    ).execute("SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, \"%Y-%m-%d\") as birth_date, cpf, address, city, state FROM person");
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
          el.id_person
        )
      );
    });

    return allPeople;
  }

  public static async findById(id: number): Promise<Person> {
    const [rows] = await (
      await conn
    ).execute("SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, \"%Y-%m-%d\") as birth_date, cpf, address, city, state FROM person WHERE id = ?", [id.toString()]);
    let arrPerson: PersonData = Object.values(rows)[0];
    let person: Person;
    if (undefined === arrPerson) person = new Person();
    else
      person = new Person(
          arrPerson.name,
          arrPerson.email,
          arrPerson.phone,
          arrPerson.birth_date,
          arrPerson.cpf,
          arrPerson.address,
          arrPerson.city,
          arrPerson.state,
          arrPerson.id_person
      );

    return person;
  }

  public static async findByCpf(cpf: string, currentId: number = 0): Promise<Person> {
    let sql: string;
    let data: string[];
    if (0 === currentId) {
      sql = "SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, \"%Y-%m-%d\") as birth_date, cpf, address, city, state FROM person WHERE cpf = ?";
      data = [cpf];
    } else {
      sql = "SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, \"%Y-%m-%d\") as birth_date, cpf, address, city, state FROM person WHERE cpf = ? and id <> ?";
      data = [cpf, currentId.toString()];
    }
    const [rows] = await (await conn).execute(sql, data);
    let arrPerson: PersonData = Object.values(rows)[0];
    let person: Person;
    if (undefined === arrPerson) person = new Person();
    else
      person = new Person(
        arrPerson.name,
        arrPerson.email,
        arrPerson.phone,
        arrPerson.birth_date,
        arrPerson.cpf,
        arrPerson.address,
        arrPerson.city,
        arrPerson.state,
        arrPerson.id_person
      );

    return person;
  }

  public static async findByBirthDateAndName(birth_date: string, name: string, currentId: number = 0): Promise<Person> {
    let sql: string;
    let data: string[];
    if (0 === currentId) {
      sql = "SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, \"%Y-%m-%d\") as birth_date, cpf, address, city, state FROM person WHERE birth_date = ? AND name = ?";
      data = [birth_date, name];
    } else {
      sql = "SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, \"%Y-%m-%d\") as birth_date, cpf, address, city, state FROM person WHERE birth_date = ? AND name = ? AND id <> ?";
      data = [birth_date, name, currentId.toString()];
    }
    const [rows] = await (await conn).execute(sql, data);
    let arrPerson: PersonData = Object.values(rows)[0];
    let person: Person;
    if (undefined === arrPerson) person = new Person();
    else
      person = new Person(
        arrPerson.name,
        arrPerson.email,
        arrPerson.phone,
        arrPerson.birth_date,
        arrPerson.cpf,
        arrPerson.address,
        arrPerson.city,
        arrPerson.state,
        arrPerson.id_person
      );

    return person;
  }

  public static async create(person: Person): Promise<number> {
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("INSERT INTO person(name, email, phone, birth_date, cpf, address, city, state) VALUES(?, ?, ?, ?, ?, ?, ?, ?)", [
      person.name,
      person.email,
      person.phone,
      Helper.nullForEmpty(person.birth_date),
      Helper.nullForEmpty(person.cpf),
      Helper.nullForEmpty(person.address),
      Helper.nullForEmpty(person.city),
      Helper.nullForEmpty(person.state)
    ]);
    let id: number;
    if (undefined !== rst[0].insertId) id = rst[0].insertId;
    else id = 0;

    return id;
  }

  public static async update(person: Person): Promise<boolean> {
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("UPDATE person SET name = ?, email = ?, phone = ?, birth_date = ?, cpf = ?, address = ?, city = ?, state = ? WHERE id = ?", [
      person.name,
      person.email,
      person.phone,
      Helper.nullForEmpty(person.birth_date),
      Helper.nullForEmpty(person.cpf),
      Helper.nullForEmpty(person.address),
      Helper.nullForEmpty(person.city),
      Helper.nullForEmpty(person.state),
      person.id_person.toString(),
    ]);
    let cr: boolean;
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }

  public static async delete(person: Person): Promise<boolean> {
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM person WHERE id = ?", [person.id_person.toString()]);
    let cr: boolean;
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
