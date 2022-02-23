import { BookCopyData } from "../interfaces/BookCopy.interface";
import { ResponseData } from "../interfaces/Common.interface";
import Book from "./Book.class";
import Person from "./Person.class";
import validator from "validator";

export default class BookCopy {
  /**
   * Attributes
   */
  private _id: number;
  private _description: string;
  private _buy_or_gift: string;
  private _buy_or_gift_date: string | null;
  private _obs: string | null;
  private _receiver_person: Person;
  private _book: Book;
  private _photo: string | null;

  constructor(
    description: string = "",
    buy_or_gift: string = "",
    buy_or_gift_date: string | null = null,
    obs: string | null = null,
    receiver_person: Person = new Person(),
    book: Book = new Book(),
    photo: string | null = null,
    id: number = 0
  ) {
    this._id = id;
    this._description = description;
    this._buy_or_gift = buy_or_gift;
    this._buy_or_gift_date = buy_or_gift_date;
    this._obs = obs;
    this._receiver_person = receiver_person;
    this._book = book;
    this._photo = photo;
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

  public get buy_or_gift(): string {
    return this._buy_or_gift;
  }

  public get buy_or_gift_date(): string | null {
    return this._buy_or_gift_date;
  }

  public get obs(): string | null {
    return this._obs;
  }

  public get receiver_person(): Person {
    return this._receiver_person;
  }

  public get book(): Book {
    return this._book;
  }

  public get photo(): string | null {
    return this._photo;
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

  public set buy_or_gift(v: string) {
    this._buy_or_gift = v;
  }

  public set buy_or_gift_date(v: string | null) {
    this._buy_or_gift_date = v;
  }

  public set obs(v: string | null) {
    this._obs = v;
  }

  public set receiver_person(v: Person) {
    this._receiver_person = v;
  }

  public set book(v: Book) {
    this._book = v;
  }

  public set photo(v: string | null) {
    this._photo = v;
  }

  /**
   * return the correct array format, this is usefull to avoid '_' before propertie names
   * @returns st: @BookCopyData
   */
  public toJson(): BookCopyData {
    const st: BookCopyData = {
      id: this._id,
      description: this._description,
      buy_or_gift: this._buy_or_gift,
      buy_or_gift_date: this._buy_or_gift_date,
      obs: this._obs,
      receiver_person: this._receiver_person,
      book: this._book,
      photo: this._photo,
    };

    return st;
  }

  /**
   * Validate data for genre
   * @returns response: @ResponseData
   */
  public validate(): ResponseData {
    let response: ResponseData;

    if (this.description === "") throw new Error("Informe a descrição da edição do livro");
    if (this.description.length > 200)
      throw new Error("Tamanho máximo da descrição da edição é de 200 caracteres");

    if (this.book.id === 0) throw new Error("E obrigatório vincular um livro");

    if (this.buy_or_gift.length > 1 || !this.buy_or_gift.match(/(?:^|\W)(G|B)(?:$|\W)/gm))
      throw new Error("Origem(comprado ou presente) inválida");

    if (this.buy_or_gift_date != null) {
      if (!validator.isDate(this.buy_or_gift_date))
        throw new Error("Data da origem(Comprado ou Presente) é inválida");
    }

    if (this.obs != null) {
      if (this.obs.length > 200)
        throw new Error("Tamanho máximo da observação da edição é de 200 caracteres");
    }

    if (this.receiver_person.id_person === 0)
      throw new Error("É obrigatório vincular um dono ao livro.");

    if (this.photo != null) {
      if (this.photo.length > 30) throw new Error("Ocorreu um erro ao registrar a foto no livro");
    }

    try {
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
