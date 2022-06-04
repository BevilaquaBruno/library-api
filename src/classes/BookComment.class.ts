import { BookCommentDataInterfaces, BookCommentDataInterfacesNoBook } from "../interfaces/BookComment.interface";
import { ResponseData } from "../interfaces/Common.interface";
import Book from "./Book.class";
import Person from "./Person.class";

export default class BookComment {
  /**
   * Private attributes
   */
  private _id: number;
  private _description: string;
  private _vote: boolean;
  private _visible: boolean;
  private _book: Book;
  private _person: Person | null;

  constructor(description = "", vote = false, visible = false, id: number = 0) {
    this._id = id;
    this._description = description;
    this._vote = vote;
    this._visible = visible;
    this._book = new Book();
    this._person = null;
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

  public get vote(): boolean {
    return this._vote;
  }

  public get visible(): boolean {
    return this._visible;
  }

  public get book(): Book {
    return this._book;
  }

  public get person(): Person | null {
    return this._person;
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

  public set vote(v: boolean) {
    this._vote = v;
  }

  public set visible(v: boolean) {
    this._visible = v;
  }

  public set book(v: Book) {
    this._book = v;
  }

  public set person(v: Person | null) {
    this._person = v;
  }

  /**
   * return the correct array format, this is usefull to avoid '_' before propertie names
   * @returns st: @BookCommentData
   */
  public toJson(): BookCommentDataInterfaces {
    const st: BookCommentDataInterfaces = {
      id: this._id,
      description: this._description,
      vote: this._vote,
      visible: this._visible,
      person: null === this._person ? null : this._person.toJson(),
      book: this._book.toJson(),
    };

    return st;
  }

    /**
   * return the correct array format, this is usefull to avoid '_' before propertie names without the book
   * @returns st: @BookCommentData
   */
     public toJsonNoBook(): BookCommentDataInterfacesNoBook {
      const st: BookCommentDataInterfacesNoBook = {
        id: this._id,
        description: this._description,
        vote: this._vote,
        visible: this._visible,
        person: null === this._person ? null : this._person.toJson()
      };

      return st;
    }

  /**
   * Validate data for genre
   * @returns response: @ResponseData
   */
  public validate(): ResponseData {
    let response: ResponseData;

    if (this.description === "") throw new Error("Informe o comentário sobre o livro");

    if (this.book.id === 0)
      throw new Error(
        "Erro grave ao gravar o comentário, o livro não foi vinculado, atualize a página e tente novamente."
      );

    if (null !== this._person) {
      if (0 === this._person.id_person)
        throw new Error(
          "Erro grave ao gravar o comentário, o código da pessoa é inválido, atualize a página e tente novamente."
        );
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
          message: (e as Error)?.message ?? "Erro grave ao validar dados do comentário",
        },
      };
    }

    return response;
  }
}
