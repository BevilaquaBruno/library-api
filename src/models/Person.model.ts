/**
 * Data model for Person
 */
import { ResultSetHeader } from "mysql2";
import DatabaseConnection from "../../db/db";
import Helper from "../classes/Helper.class";
import Person from "../classes/Person.class";
import { PersonData } from "../interfaces/Person.interface";

// get connection
const conn = DatabaseConnection.getConnection();

/**
 * model class for person
 */
export default class PersonModel {
  /**
   * Find all people
   * @return Promise<Person[]> a list of @Person instances
   */
  public static async findAll(): Promise<Person[]> {
    let allPeople: Person[] = [];
    //1. execute sql
    const [rows] = await (
      await conn
    ).execute(
      'SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, "%Y-%m-%d") as birth_date, cpf, address, city, state FROM person'
    );
    /**
     * 2. for each person create a @Person instance
     */
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

  /**
   * Find a person with the given id
   * @param id - person id - 1
   * @return Promise<Person> a @Person instance, if id is 0 the person does not exists
   */
  public static async findById(id: number): Promise<Person> {
    //1. execute sql with the id
    const [rows] = await (
      await conn
    ).execute(
      'SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, "%Y-%m-%d") as birth_date, cpf, address, city, state FROM person WHERE id = ?',
      [id.toString()]
    );
    //2. get data
    let arrPerson: PersonData = Object.values(rows)[0];
    let person: Person;
    //3. if person list is undefined return id = 0
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

  /**
   * Find a person with the given cpf
   * @param cpf - person cpf - 103.411.729-79
   * @param currentId - the id to avoid in search - 1
   * @return Promise<Person> a @Person instance, if id is 0 the person does not exists
   */
  public static async findByCpf(cpf: string, currentId = 0): Promise<Person> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql =
        'SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, "%Y-%m-%d") as birth_date, cpf, address, city, state FROM person WHERE cpf = ?';
      data = [cpf];
    } else {
      sql =
        'SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, "%Y-%m-%d") as birth_date, cpf, address, city, state FROM person WHERE cpf = ? and id <> ?';
      data = [cpf, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let arrPerson: PersonData = Object.values(rows)[0];
    let person: Person;
    //3. if person list is undefined returns a person with id  = 0 else returns the person
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

  /**
   * Find a person with the given birth date and name
   * @param birth_date - person birth date - 2000-03-05
   * @param name - person name - Bruno Fernando Bevilaqua
   * @param currentId - the id to avoid in search - 1
   * @return Promise<Person> a @Person instance, if id is 0 the person does not exists
   */
  public static async findByBirthDateAndName(
    birth_date: string,
    name: string,
    currentId = 0
  ): Promise<Person> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql =
        'SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, "%Y-%m-%d") as birth_date, cpf, address, city, state FROM person WHERE birth_date = ? AND name = ?';
      data = [birth_date, name];
    } else {
      sql =
        'SELECT id as id_person, name, email, phone, DATE_FORMAT(birth_date, "%Y-%m-%d") as birth_date, cpf, address, city, state FROM person WHERE birth_date = ? AND name = ? AND id <> ?';
      data = [birth_date, name, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let arrPerson: PersonData = Object.values(rows)[0];
    let person: Person;
    //3. if person list is undefined returns a person with id  = 0 else returns the person
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

  /**
   * Create a person
   * @param person - the person to insert
   * @return Promise<number> the id of the inserted person, if id is 0 the person does not exists
   */
  public static async create(person: Person): Promise<number> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute(
      "INSERT INTO person(name, email, phone, birth_date, cpf, address, city, state) VALUES(?, ?, ?, ?, ?, ?, ?, ?)",
      [
        person.name,
        person.email,
        person.phone,
        Helper.nullForEmpty(person.birth_date),
        Helper.nullForEmpty(person.cpf),
        Helper.nullForEmpty(person.address),
        Helper.nullForEmpty(person.city),
        Helper.nullForEmpty(person.state),
      ]
    );
    let id: number;
    //2. if returned id is undefined returns 0 for function else returns the id
    if (undefined !== rst[0].insertId) id = rst[0].insertId;
    else id = 0;

    return id;
  }

  /**
   * update a person
   * @param person - the person to update
   * @return Promise<boolean> true or false, updated or not
   */
  public static async update(person: Person): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute(
      "UPDATE person SET name = ?, email = ?, phone = ?, birth_date = ?, cpf = ?, address = ?, city = ?, state = ? WHERE id = ?",
      [
        person.name,
        person.email,
        person.phone,
        Helper.nullForEmpty(person.birth_date),
        Helper.nullForEmpty(person.cpf),
        Helper.nullForEmpty(person.address),
        Helper.nullForEmpty(person.city),
        Helper.nullForEmpty(person.state),
        person.id_person.toString(),
      ]
    );
    let cr: boolean;
    //2. if return id is undefined returns 0 for function, else returns the id
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }

  /**
   * delete a person
   * @param person - the person to delete
   * @return Promise<boolean> true or false, deleted or not
   */
  public static async delete(person: Person): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM person WHERE id = ?", [person.id_person.toString()]);
    let cr: boolean;
    //2. returns true or false based in sql result
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
