/**
 * Data Model Interfaces
 */
import User from "../classes/User.class";
import { UserData, UserDataComplete } from "../interfaces/User.interface";
import DatabaseConnection from "../../db/db";
import { ResultSetHeader } from "mysql2";
import Helper from "../classes/Helper.class";

const conn = DatabaseConnection.getConnection();

export default class UserModel {
  public static async findByEmail(email: string, currentId: number = 0): Promise<User> {
    let sql: string;
    let data: string[];
    if (0 === currentId) {
      sql = "SELECT id, name, username, email, password FROM user WHERE email = ?";
      data = [email];
    } else {
      sql = "SELECT id, name, username, email, password FROM user WHERE email = ? and id <> ?";
      data = [email, currentId.toString()];
    }
    const [rows] = await (await conn).execute(sql, data);
    let arrUser: UserDataComplete = Object.values(rows)[0];
    let user: User;
    if (undefined === arrUser) user = new User();
    else user = new User(arrUser.name, arrUser.username, arrUser.email, arrUser.id);

    return user;
  }

  public static async findByUsername(username: string, currentId: number = 0): Promise<User> {
    let sql: string;
    let data: string[];
    if (0 === currentId) {
      sql = "SELECT id, name, username, email, password FROM user WHERE username = ?";
      data = [username];
    } else {
      sql = "SELECT id, name, username, email, password FROM user WHERE username = ? and id <> ?";
      data = [username, currentId.toString()];
    }
    const [rows] = await (await conn).execute(sql, data);
    let arrUser: UserDataComplete = Object.values(rows)[0];
    let user: User;
    if (undefined === arrUser) {
      user = new User();
    } else {
      user = new User(arrUser.name, arrUser.username, arrUser.email, arrUser.id);
      user.password = arrUser.password;
    }

    return user;
  }

  public static async findById(id: number): Promise<User> {
    const [rows] = await (
      await conn
    ).execute("SELECT id, name, username, email, password FROM user WHERE id = ?", [id.toString()]);
    let arrUser: UserDataComplete = Object.values(rows)[0];
    let user: User;
    if (undefined === arrUser) user = new User();
    else user = new User(arrUser.name, arrUser.username, arrUser.email, arrUser.id);

    return user;
  }

  public static async findAll(): Promise<User[]> {
    let allUsers: User[] = [];
    const [rows] = await (await conn).execute("SELECT id, name, username, email FROM user");
    Object.values(rows).map((el: UserData) =>
      allUsers.push(new User(el.name, el.username, el.email, el.id))
    );

    return allUsers;
  }

  public static async create(user: User): Promise<number> {
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("INSERT INTO user(name, username, email, password) VALUES(?, ?, ?, ?)", [
      user.name,
      user.username,
      user.email,
      Helper.nullForEmpty(user.password),
    ]);
    let id: number;
    if (undefined !== rst[0].insertId) id = rst[0].insertId;
    else id = 0;

    return id;
  }

  public static async update(user: User): Promise<boolean> {
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("UPDATE user SET name = ?, username = ?, email = ? WHERE id = ?", [
      user.name,
      user.username,
      user.email,
      user.id.toString(),
    ]);
    let us: boolean;
    if (undefined !== rst[0].affectedRows) us = true;
    else us = false;

    return us;
  }

  public static async updatePassword(user: User): Promise<boolean> {
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("UPDATE user SET password = ? WHERE id = ?", [Helper.nullForEmpty(user.password), user.id.toString()]);
    let us: boolean;
    if (undefined !== rst[0].affectedRows) us = true;
    else us = false;

    return us;
  }

  public static async delete(user: User): Promise<boolean> {
    const rst: ResultSetHeader | any = await (
      await conn
    ).execute("DELETE FROM user WHERE id = ?", [user.id.toString()]);
    let cr: boolean;
    if (undefined !== rst[0].affectedRows) cr = true;
    else cr = false;

    return cr;
  }
}
