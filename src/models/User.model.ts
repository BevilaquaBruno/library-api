/**
 * Data Model Interfaces
 */
import User from "../classes/User.class";
import { UserData, UserDataComplete } from "../interfaces/User.interface";
import DatabaseConnection from "../../db/db";
import { ResultSetHeader } from "mysql2";
import Helper from "../classes/Helper.class";

// get connection
const conn = DatabaseConnection.getConnection();

/**
 * model class for user
 */
export default class UserModel {
  /**
   * Find a user with the given email
   * @param email - user email - bbbevilaqua@gmail.com
   * @param currentId - the id to avoid in search - 1
   * @return Promise<User> a @User instance, if id is 0 the user does not exists
   */
  public static async findByEmail(email: string, currentId = 0): Promise<User> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql = "SELECT id, name, username, email, password FROM user WHERE email = ?";
      data = [email];
    } else {
      sql = "SELECT id, name, username, email, password FROM user WHERE email = ? and id <> ?";
      data = [email, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let arrUser: UserDataComplete = Object.values(rows)[0];
    let user: User;
    //3. if user list is undefined returns a user with id  = 0 else returns the user
    if (undefined === arrUser) user = new User();
    else user = new User(arrUser.name, arrUser.username, arrUser.email, arrUser.id);

    return user;
  }

  /**
   * Find a user with the given username
   * @param username - user username - bevilaqua
   * @param currentId - the id to avoid in search - 1
   * @return Promise<User> a @User instance, if id is 0 the user does not exists
   */
  public static async findByUsername(username: string, currentId = 0): Promise<User> {
    let sql: string;
    let data: string[];
    //1. if currentId in different from 0 so the sql desconsider the id in select
    if (0 === currentId) {
      sql = "SELECT id, name, username, email, password FROM user WHERE username = ?";
      data = [username];
    } else {
      sql = "SELECT id, name, username, email, password FROM user WHERE username = ? and id <> ?";
      data = [username, currentId.toString()];
    }
    //2. execute the sql and get the data
    const [rows] = await (await conn).execute(sql, data);
    let arrUser: UserDataComplete = Object.values(rows)[0];
    let user: User;
    //3. if user list is undefined returns a user with id  = 0 else returns the user
    if (undefined === arrUser) {
      user = new User();
    } else {
      user = new User(arrUser.name, arrUser.username, arrUser.email, arrUser.id);
      user.password = arrUser.password;
    }

    return user;
  }

  /**
   * Find a user with the given email
   * @param Id - user id - 1
   * @return Promise<User> a @User instance, if id is 0 the user does not exists
   */
  public static async findById(id: number): Promise<User> {
    //1. execute sql with the id
    const [rows] = await (
      await conn
    ).execute("SELECT id, name, username, email, password FROM user WHERE id = ?", [id.toString()]);
    //2. get data
    let arrUser: UserDataComplete = Object.values(rows)[0];
    let user: User;
    //3. if person list is undefined return id = 0
    if (undefined === arrUser) user = new User();
    else user = new User(arrUser.name, arrUser.username, arrUser.email, arrUser.id);

    return user;
  }

  /**
   * Find all users
   * @return Promise<User[]> a list of @User instances
   */
  public static async findAll(): Promise<User[]> {
    let allUsers: User[] = [];
    //1. execute sql
    const [rows] = await (await conn).execute("SELECT id, name, username, email FROM user");
    /**
     * 2. for each person create a @Person instance
     */
    Object.values(rows).map((el: UserData) =>
      allUsers.push(new User(el.name, el.username, el.email, el.id))
    );

    return allUsers;
  }

  /**
   * Create a user
   * @param user - the user to insert
   * @return Promise<number> the id of the inserted user, if id is 0 the user does not exists
   */
  public static async create(user: User): Promise<number> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("INSERT INTO user(name, username, email, password) VALUES(?, ?, ?, ?)", [
      user.name,
      user.username,
      user.email,
      Helper.nullForEmpty(user.password),
    ]);
    let id: number;
    //2. if returned id is undefined returns 0 for function else returns the id
    if (undefined !== rst[0].insertId) id = rst[0].insertId;
    else id = 0;

    return id;
  }

  /**
   * update a user
   * @param user - the user to update
   * @return Promise<boolean> true or false, updated or not
   */
  public static async update(user: User): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("UPDATE user SET name = ?, username = ?, email = ? WHERE id = ?", [
      user.name,
      user.username,
      user.email,
      user.id.toString(),
    ]);
    let us: boolean;
    //2. if return id is undefined returns 0 for function, else returns the id
    if (undefined !== rst[0].affectedRows) us = true;
    else us = false;

    return us;
  }

  /**
   * update a user password
   * @param user - the user to update the password
   * @return Promise<boolean> true or false, updated or not
   */
  public static async updatePassword(user: User): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("UPDATE user SET password = ? WHERE id = ?", [
      Helper.nullForEmpty(user.password),
      user.id.toString(),
    ]);
    let us: boolean;
    //2. if return id is undefined returns 0 for function, else returns the id
    if (undefined !== rst[0].affectedRows) us = true;
    else us = false;

    return us;
  }

  /**
   * delete a user
   * @param user - the user to delete
   * @return Promise<boolean> true or false, deleted or not
   */
  public static async delete(user: User): Promise<boolean> {
    //1. execute sql
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM user WHERE id = ?", [user.id.toString()]);
    let cr: boolean;
    //2. returns true or false based in sql result
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
