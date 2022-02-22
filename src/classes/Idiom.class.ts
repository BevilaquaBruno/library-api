import { ResponseData } from "../interfaces/Common.interface";
import { IdiomData } from "../interfaces/Idiom.interface";

export default class Idiom {
  /**
   * Attributtes
   */
  private _id: number;
  private _description: string;

  constructor(description: string = "", id: number = 0) {
    this._id = id;
    this._description = description;
  }

  /**
   * Getters
   */
  public get id(): number {
    return this._id;
  }

  public get description(): string {
    return this._description;
  }

  /**
   * Setters
   */
  public set id(v: number) {
    this._id = v;
  }

  public set description(v: string) {
    this._description = v;
  }

  /**
   * return the correct array format, this is usefull to avoid '_' before propertie names
   * @returns st: @IdiomData
   */
  public toJson(): IdiomData {
    const st: IdiomData = {
      id: this.id,
      description: this.description,
    };

    return st;
  }

  /**
   * Validate data for idiom
   * @returns response: @ResponseData
   */
  public validate(): ResponseData {
    let response: ResponseData;

    try {
      if ("" === this.description) throw new Error("Informe o nome do idioma");

      if (30 < this.description.length)
        throw new Error("Tamanho máximo do idioma é 30 caracteres");

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
          message: (e as Error)?.message ?? "Erro grave ao validar dados do idioma",
        },
      };
    }

    return response;
  }
}
