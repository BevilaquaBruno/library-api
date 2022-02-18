import { ResponseData } from "../interfaces/Common.interface";
import { PublisherData } from "../interfaces/Publisher.interface";
import Country from "./Country.class";

export default class Publisher {
  /**
   * Attributes
   */
  private _id: number;
  private _name: string;
  private _cnpj: string;
  private _country: Country;

  constructor(
    name: string = "",
    cnpj: string = "",
    country: Country = new Country(),
    id: number = 0
  ) {
    this._id = id;
    this._name = name;
    this._cnpj = cnpj;
    this._country = country;
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

  public get cnpj(): string {
    return this._cnpj;
  }

  public get country(): Country {
    return this._country;
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

  public set cnpj(v: string) {
    this._cnpj = v;
  }

  public set country(v: Country) {
    this._country = v;
  }

  /**
   * return the correct array format, this is usefull to avoid '_' before propertie names
   * @returns ps: @PublisherData
   */
  public toJson(): PublisherData {
    const ps: PublisherData = {
      id: this.id,
      name: this.name,
      cnpj: this.cnpj,
      country: this.country,
    };

    return ps;
  }

  /**
   * Validate data for publisher
   * @returns response: @ResponseData
   */
  public validate(): ResponseData {
    let response: ResponseData;
    try {
      if ("" === this._name) throw new Error("Informe o nome da Editora");

      if (100 < this._name.length) throw new Error("Tamanho máximo do nome é 100 caracteres");
      if (18 != this._cnpj.length) throw new Error("CNPJ Inválido");

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
          message: (e as Error)?.message ?? "Erro grave ao validar dados da editora",
        },
      };
    }
    return response;
  }
}
