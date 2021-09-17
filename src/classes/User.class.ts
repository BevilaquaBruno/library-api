import { ResponseData } from "../interfaces/Common.interface";
import { UserData } from "../interfaces/User.interface";
import Validator from "validator";

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
    this._password = "";
  }

  /**
   * Getters
   */
  public get id(): number {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get username(): string {
    return this._username;
  }

  public get email(): string {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }

  /**
   * Setters
   */
  public set id(v: number) {
    this._id = v;
  }

  public set name(v: string) {
    this._name = v;
  }

  public set username(v: string) {
    this._username = v;
  }

  public set email(v: string) {
    this._email = v;
  }

  public set password(v: string) {
    this._password = v;
  }

  /**
   * Methods
   */
  public toJson(): UserData {
    const us: UserData = {
      id: this._id,
      name: this._name,
      username: this._username,
      email: this._email,
    };
    return us;
  }

  public validate(): ResponseData {
    let response: ResponseData;
    try {
      if ("" === this._name) throw new Error("Informe o nome do usuário");
      if ("" === this._username) throw new Error("Informe o username do usuário");
      if ("" === this._email) throw new Error("Informe o email do usuário");

      if (50 < this._name.length) throw new Error("Tamanho máximo do nome é 50 caracteres");
      if (20 < this._username.length) throw new Error("Tamanho máximo do username é 20 caracteres");
      if (50 < this._email.length) throw new Error("Tamanho máximo do email é 50 caracteres");

      if (!Validator.isEmail(this._email)) throw new Error("Email inválido");

      response = {
        data: {},
        status: {
          error: false,
          message: "",
        },
      };
    } catch (e) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro grave ao validar dados do usuário",
        },
      };
    }

    return response;
  }
}
