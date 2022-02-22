import Country from "./Country.class";
import { AuthorData } from "../interfaces/Author.interface";
import { ResponseData } from "../interfaces/Common.interface";
import validator from "validator";

export default class Author {
  /**
   * Attributes
   */
  private _id: number;
  private _name: string;
  private _fullName: string;
  private _birth_date: string;
  private _death_date: string;
  private _born_date: string;
  private _born_place: string;
  private _death_place: string;
  private _born_country: Country;
  private _death_country: Country;

  constructor(
    name: string = "",
    fullName: string = "",
    birth_date: string = "",
    death_date: string = "",
    born_date: string = "",
    born_place: string = "",
    death_place: string = "",
    born_country: Country = new Country(),
    death_country: Country = new Country(),
    id: number
  ) {
    this._id = id;
    this._name = name;
    this._fullName = fullName;
    this._birth_date = birth_date;
    this._death_date = death_date;
    this._born_date = born_date;
    this._born_place = born_place;
    this._death_place = death_place;
    this._born_country = born_country;
    this._death_country = death_country;
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

  public get death_date(): string {
    return this._death_date;
  }

  public get birth_date(): string {
    return this._birth_date;
  }

  public get born_date(): string {
    return this._born_date;
  }

  public get born_place(): string {
    return this._born_place;
  }

  public get death_place(): string {
    return this._death_place;
  }

  public get born_country(): Country {
    return this._born_country;
  }

  public get death_country(): Country {
    return this._death_country;
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

  public set death_date(v: string) {
    this._death_date = v;
  }

  public set birth_date(v: string) {
    this._birth_date = v;
  }

  public set born_date(v: string) {
    this._born_date = v;
  }

  public set born_place(v: string) {
    this._born_place = v;
  }

  public set death_place(v: string) {
    this._death_place = v;
  }

  public set born_country(v: Country) {
    this._born_country = v;
  }

  public set death_country(v: Country) {
    this._death_country = v;
  }

  /**
   * return the correct array format, this is usefull to avoid '_' before propertie names
   * @returns st: @AuthorData
   */
  public toJson(): AuthorData {
    const st: AuthorData = {
      id: this.id,
      name: this.name,
      fullName: this.fullName,
      birth_date: this.birth_date,
      death_date: this.death_date,
      born_date: this.born_date,
      born_place: this.born_place,
      death_place: this.death_place,
      born_country: this.born_country,
      death_country: this.death_country,
    };

    return st;
  }

  /**
   * Validate data for genre
   * @returns response: @ResponseData
   */
  public validate(): ResponseData {
    let response: ResponseData;

    try {
      if (this.name === "") throw new Error("Informe o nome do autor");

      if (this.name.length > 100) throw new Error("Tamanho máximo do nome é 100 caracteres");
      if (this.fullName.length > 150)
        throw new Error("Tamanho máximo do nome completo é 150 caracteres");
      if (this.born_place.length > 100)
        throw new Error("Tamanho máximo do local de nascimento é 100 caracteres");
      if (this.born_place.length > 100)
        throw new Error("Tamanho máximo do local da morte é 100 caracteres");

      if ("" != this._birth_date) {
        let b_date: Date = new Date(this._birth_date);
        if (validator.isAfter(b_date.toString()))
          throw new Error("Data de nascimento não pode ser maior que hoje");
      }

      if ("" != this._death_date) {
        let b_date: Date = new Date(this._death_date);
        if (validator.isAfter(b_date.toString()))
          throw new Error("Data de nascimento não pode ser maior que hoje");
      }

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
          message: (e as Error)?.message ?? "Erro grave ao validar dados do gênero",
        },
      };
    }

    return response;
  }
}
