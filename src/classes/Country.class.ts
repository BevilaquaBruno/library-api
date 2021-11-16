import { ResponseData } from "../interfaces/Common.interface";
import { CountryData } from "../interfaces/Country.interface";
import Helper from "./Helper.class";

export default class Country {
  /**
   * Attributes
   */
  private _id: number;
  private _name: string;
  private _fullName: string;
  private _short: string;
  private _flag: string;

  /**
   *
   * @param id id of the table in the table country
   * @param name name of the coutry e.g.: Brasil
   * @param fullName full name of the country e.g.: República Federativa do Brasil
   * @param short short of the country e.g.: BRA
   * @param flag flag file of the country e.g.: brasil_flag.png
   */
  constructor(
    name: string = "",
    fullName: string = "",
    short: string = "",
    flag: string = "",
    id: number = 0
  ) {
    this._id = id;
    this._name = name;
    this._fullName = fullName;
    this._short = short;
    this._flag = flag;
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

  public get fullName(): string {
    return this._fullName;
  }

  public get short(): string {
    return this._short;
  }

  public get flag(): string {
    return this._flag;
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

  public set fullName(v: string) {
    this._fullName = v;
  }

  public set short(v: string) {
    this._short = v;
  }

  public set flag(v: string) {
    this._flag = v;
  }

  /**
   * Methods
   */
  public toJson(): CountryData {
    const ct: CountryData = {
      id: this._id,
      name: this._name,
      fullName: this._fullName,
      short: Helper.nullForEmpty(this._short),
      flag: Helper.nullForEmpty(this._flag),
    };
    return ct;
  }

  public validate(): ResponseData {
    let response: ResponseData;
    try {
      if ("" === this._name) throw new Error("Informe o nome do país");
      if ("" === this._fullName) throw new Error("Informe o nome completo do país");
      if ("" === this._short) throw new Error("Informe a sigla do país");

      if (50 < this._name.length) throw new Error("Tamanho máximo do nome é 50 caracteres");
      if (100 < this._fullName.length)
        throw new Error("Tamanho máximo do nome completo é 100 caracteres");
      if (3 < this._short.length) throw new Error("Tamanho máximo da sigla é 3 caracteres");

      response = {
        data: {},
        status: {
          error: false,
          message: "",
        },
      };
    } catch (e: any) {
      response = {
        data: {},
        status: {
          error: true,
          message: (e as Error)?.message ?? "Erro grave ao validar dados do país",
        },
      };
    }

    return response;
  }
}
