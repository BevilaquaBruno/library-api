import Publisher from "./Publisher.class";
import { BookData } from "../interfaces/Book.interface";
import { ResponseData } from "../interfaces/Common.interface";

export default class Book {
  /**
   * Attributes
   */
  private _id: number;
  private _name: string;
  private _volumn: number | null;
  private _number_pages: number | null;
  private _edition: number | null;
  private _release_year: number | null;
  private _author_obs: string | null;
  private _obs: string | null;
  private _isbn: string | null;
  private _publisher: Publisher | null;

  constructor(
    name: string = "",
    volumn: number | null = null,
    number_pages: number | null = null,
    edition: number | null = null,
    release_year: number | null = null,
    author_obs: string | null = null,
    obs: string | null = null,
    isbn: string | null = null,
    publisher: Publisher | null = null,
    id: number = 0
  ) {
    this._id = id;
    this._name = name;
    this._volumn = volumn;
    this._number_pages = number_pages;
    this._edition = edition;
    this._release_year = release_year;
    this._author_obs = author_obs;
    this._obs = obs;
    this._isbn = isbn;
    this._publisher = publisher;
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

  public get volumn(): number | null {
    return this._volumn;
  }

  public get number_pages(): number | null {
    return this._number_pages;
  }

  public get edition(): number | null {
    return this._edition;
  }

  public get release_year(): number | null {
    return this._release_year;
  }

  public get author_obs(): string | null {
    return this._author_obs;
  }

  public get obs(): string | null {
    return this._obs;
  }

  public get isbn(): string | null {
    return this._isbn;
  }

  public get publisher(): Publisher | null {
    return this._publisher;
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

  public set volumn(v: number | null) {
    this._volumn = v;
  }

  public set number_pages(v: number | null) {
    this._number_pages = v;
  }

  public set edition(v: number | null) {
    this._edition = v;
  }

  public set release_year(v: number | null) {
    this._release_year = v;
  }

  public set author_obs(v: string | null) {
    this._author_obs = v;
  }

  public set obs(v: string | null) {
    this._obs = v;
  }

  public set isbn(v: string | null) {
    this._isbn = v;
  }

  public set publisher(v: Publisher | null) {
    this._publisher = v;
  }

  /**
   * return the correct array format, this is usefull to avoid '_' before propertie names
   * @returns st: @BookData
   */
  public toJson(): BookData {
    const st: BookData = {
      id: this.id,
      name: this.name,
      volumn: this.volumn,
      number_pages: this.number_pages,
      edition: this.edition,
      release_year: this.release_year,
      author_obs: this.author_obs,
      obs: this.obs,
      isbn: this.isbn,
      publisher: this.publisher,
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
      if (this.name === "") throw new Error("Informe o nome do livro");
      if (this.name.length > 100)
        throw new Error("Tamanho máximo do nome do livro é 100 caracteres");

      const currentDate: Date = new Date(Date.now());
      if (null != this.release_year) {
        if (this.release_year > currentDate.getFullYear())
          throw new Error("Ano de lançamento não pode ser maior que o ano atual");
      }

      if (null != this.author_obs) {
        if (this.author_obs.length > 200)
          throw new Error("Tamanho máximo da observação do autor é 200 caracteres");
      }
      if (null != this.obs) {
        if (this.obs.length > 200) throw new Error("Tamanho máximo da observação é 200 caracteres");
      }
      if (null != this.isbn) {
        if (this.isbn.length > 13) throw new Error("Tamanho máximo do ISBN é 13 caracteres");
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
          message: (e as Error)?.message ?? "Erro grave ao validar dados do livro",
        },
      };
    }

    return response;
  }
}
