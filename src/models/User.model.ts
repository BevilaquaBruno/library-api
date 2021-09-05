/**
 * Data Model Interfaces
 */
import User from "../classes/User.class";
import { UserDataComplete } from "../interfaces/User.interface";
import DatabaseConnection from '../../db/db';

var conn = DatabaseConnection.getConnection();

export default class UserModel {
  public static async findByUsername(username: string): Promise<User> {
    const [ rows ] = await (await conn).execute("SELECT id, name, username, email, password FROM user WHERE username = ?",
      [username]);
    let arrUser: UserDataComplete = Object.values(rows)[0];
    let user: User;
    if (undefined === arrUser) {
      user = new User();
    }else{
      user = new User(arrUser.name, arrUser.username, arrUser.email, arrUser.password, arrUser.id);
    }

    return user;
  }
}