import { ResponseData } from "../interfaces/Common.interface";
import { CountryData } from "../interfaces/Country.interface";

export default class Country {
  /**
   * Attributes
   */
  private _id: number;
  private _name: string;
  private _fullName: string | null;
  private _short: string;
  private _flag: string | null;

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
    fullName: string | null = null,
    short: string = "",
    flag: string | null = null,
    id: number = 0
  ) {
    this._id = id;
    this._name = name;
    this._fullName = "" === fullName ? null : fullName;
    this._short = short;
    this._flag = "" === flag ? null : flag;
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

  public get fullName(): string | null {
    return this._fullName;
  }

  public get short(): string {
    return this._short;
  }

  public get flag(): string | null {
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

  public set fullName(v: string | null) {
    this._fullName = "" === v ? null : v;
  }

  public set short(v: string) {
    this._short = v;
  }

  public set flag(v: string | null) {
    this._flag = "" === v ? null : v;
  }

  /**
   * return the correct array format, this is usefull to avoid '_' before propertie names
   * @returns ct: @CountryData
   */
  public toJson(): CountryData {
    const ct: CountryData = {
      id: this._id,
      name: this._name,
      fullName: this._fullName,
      short: this._short,
      flag: this._flag,
    };
    return ct;
  }

  /**
   * Validate data for country
   * @returns response: @ResponseData
   */
  public validate(): ResponseData {
    let response: ResponseData;
    try {
      if ("" === this.name) throw new Error("Informe o nome do país");
      if ("" === this.fullName) throw new Error("Informe o nome completo do país");
      if ("" === this.short) throw new Error("Informe a sigla do país");

      if (50 < this.name.length) throw new Error("Tamanho máximo do nome é 50 caracteres");
      if (null !== this.fullName) {
        if (100 < this.fullName.length)
          throw new Error("Tamanho máximo do nome completo é 100 caracteres");
      }
      if (3 < this.short.length) throw new Error("Tamanho máximo da sigla é 3 caracteres");

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
