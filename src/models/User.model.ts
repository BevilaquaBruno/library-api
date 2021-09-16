/**
 * Data Model Interfaces
 */
import User from "../classes/User.class";
import { UserData, UserDataComplete } from "../interfaces/User.interface";
import DatabaseConnection from "../../db/db";

const conn = DatabaseConnection.getConnection();

export default class UserModel {
  public static async findByUsername(username: string): Promise<User> {
    const [rows] = await (
      await conn
    ).execute("SELECT id, name, username, email, password FROM user WHERE username = ?", [
      username,
    ]);
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
    ).execute("SELECT id, name, username, email FROM user WHERE id = ?", [id.toString()]);
    let arrUser: UserData = Object.values(rows)[0];
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
}
