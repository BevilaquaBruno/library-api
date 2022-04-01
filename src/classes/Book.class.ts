import Publisher from "./Publisher.class";
import { BookData, BookDataInterfaces } from "../interfaces/Book.interface";
import { ResponseData } from "../interfaces/Common.interface";
import Author from "./Author.class";
import { AuthorDataInterfaces } from "../interfaces/Author.interface";

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
  private _authors: Author[] | null;

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
    this._volumn = 0 === volumn ? null : volumn;
    this._number_pages = 0 === number_pages ? null : number_pages;
    this._edition = 0 === edition ? null : edition;
    this._release_year = 0 === release_year ? null : release_year;
    this._author_obs = "" === author_obs ? null : author_obs;
    this._obs = "" === obs ? null : obs;
    this._isbn = "" === isbn ? null : isbn;
    this._publisher = publisher;
    this._authors = null;
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

  public get authors(): Author[] | null {
    return this._authors;
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
    this._volumn = 0 === v ? null : v;
  }

  public set number_pages(v: number | null) {
    this._number_pages = 0 === v ? null : v;
  }

  public set edition(v: number | null) {
    this._edition = 0 === v ? null : v;
  }

  public set release_year(v: number | null) {
    this._release_year = 0 === v ? null : v;
  }

  public set author_obs(v: string | null) {
    this._author_obs = "" === v ? null : v;
  }

  public set obs(v: string | null) {
    this._obs = "" === v ? null : v;
  }

  public set isbn(v: string | null) {
    this._isbn = "" === v ? null : v;
  }

  public set publisher(v: Publisher | null) {
    this._publisher = v;
  }

  public set authors(v: Author[] | null) {
    v = null !== v && 0 === v.length ? null : v;
    this._authors = v;
  }

  /**
   * return the correct array format, this is usefull to avoid '_' before propertie names
   * @returns st: @BookData
   */
  public toJson(): BookDataInterfaces {
    let authorList: AuthorDataInterfaces[] | null =
      null === this.authors
        ? null
        : this.authors.map((v: Author) => {
            return v.toJson();
          });
    const st: BookDataInterfaces = {
      id: this.id,
      name: this.name,
      volumn: this.volumn,
      number_pages: this.number_pages,
      edition: this.edition,
      release_year: this.release_year,
      author_obs: this.author_obs,
      obs: this.obs,
      isbn: this.isbn,
      publisher: null === this.publisher ? null : this.publisher?.toJson(),
      authors: authorList,
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
      if (null !== this.release_year) {
        if (this.release_year > currentDate.getFullYear())
          throw new Error("Ano de lançamento não pode ser maior que o ano atual");
      }

      if (null !== this.author_obs) {
        if (this.author_obs.length > 200)
          throw new Error("Tamanho máximo da observação do autor é 200 caracteres");
      }
      if (null !== this.obs) {
        if (this.obs.length > 200) throw new Error("Tamanho máximo da observação é 200 caracteres");
      }
      if (null !== this.isbn) {
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
