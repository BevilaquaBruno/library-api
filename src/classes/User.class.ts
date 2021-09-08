import { UserData } from "../interfaces/User.interface";

export default class User {
  /**
   * Attributes
   */
  private _id: number;
  private _name: string;
  private _username: string;
  private _email: string;
  private _password: string;

  /**
   *
   * @param name name of the user
   * @param username username of the user
   * @param email email of the user
   * @param password password of the user
   * @param id id of the user
   */
  constructor(name: string = "", username: string = "", email: string = "", id: number = 0) {
    this._id = id;
    this._name = name;
    this._username = username;
    this._email = email;
    this._password = '';
  }

  /**
   * Getters
   */
  public get id() : number {
    return this._id;
  }

  public get name() : string {
    return this._name;
  }

  public get username() : string {
    return this._username;
  }

  public get email() : string {
    return this._email;
  }

  public get password() : string {
    return this._password;
  }

  /**
   * Setters
   */
  public set id(v : number) {
    this._id = v;
  }

  public set name(v : string) {
    this._name = v;
  }

  public set username(v : string) {
    this._username = v;
  }

  public set email(v : string) {
    this._email = v;
  }

  public set password(v : string) {
    this._password = v;
  }

  /**
   * Methods
   */
  public toJson(): UserData {
    const us: UserData = {
      id: this._id,
      name: this._email,
      username: this._username,
      email: this._email
    }
    return us;
  }
}
