import { ResponseData } from "../interfaces/Common.interface";
import { StyleData } from "../interfaces/Style.interface";

export default class Style {
  /**
   * Attributtes
   */
  private _id: number;
  private _description: string;

  constructor(description = "", id = 0) {
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
   * @returns st: @StyleData
   */
  public toJson(): StyleData {
    const st: StyleData = {
      id: this.id,
      description: this.description,
    };

    return st;
  }

  /**
   * Validate data for style
   * @returns response: @ResponseData
   */
  public validate(): ResponseData {
    let response: ResponseData;

    try {
      if ("" === this.description) throw new Error("Informe o nome do tipo");

      if (100 < this.description.length)
        throw new Error("Tamanho máximo do tipo é 100 caracteres");

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
          message: (e as Error)?.message ?? "Erro grave ao validar dados do tipo",
        },
      };
    }

    return response;
  }
}
