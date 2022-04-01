import { ResponseData } from "../interfaces/Common.interface";
import { PersonData } from "../interfaces/Person.interface";
import validator from "validator";
import Helper from "./Helper.class";

export default class Person {
  /**
   * Attributtes
   */
  private _id_person: number;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _birth_date: string;
  private _cpf: string;
  private _address: string;
  private _city: string;
  private _state: string;

  constructor(
    name = "",
    email = "",
    phone = "",
    birth_date = "",
    cpf = "",
    address = "",
    city = "",
    state = "",
    id = 0
  ) {
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._birth_date = birth_date;
    this._cpf = cpf;
    this._address = address;
    this._city = city;
    this._state = state;
    this._id_person = id;
  }

  /**
   * Getters
   */
  public get id_person(): number {
    return this._id_person;
  }

  public get name(): string {
    return this._name;
  }

  public get email(): string {
    return this._email;
  }

  public get phone(): string {
    return this._phone;
  }

  public get birth_date(): string {
    return this._birth_date;
  }

  public get cpf(): string {
    return null === this._cpf ? "" : this._cpf;
  }

  public get address(): string {
    return null === this._address ? "" : this._address;
  }

  public get city(): string {
    return null === this._city ? "" : this._city;
  }

  public get state(): string {
    return null === this._state ? "" : this._state;
  }

  /**
   * Setters
   */

  public set id_person(v: number) {
    this._id_person = v;
  }

  public set name(v: string) {
    this._name = v;
  }

  public set email(v: string) {
    this._email = v;
  }

  public set phone(v: string) {
    this._phone = v;
  }

  public set birth_date(v: string) {
    this._birth_date = v;
  }

  public set cpf(v: string) {
    this._cpf = v;
  }

  public set address(v: string) {
    this._address = v;
  }

  public set city(v: string) {
    this._city = v;
  }

  public set state(v: string) {
    this._state = v;
  }

  /**
   * return the correct array format, this is usefull to avoid '_' before propertie names
   * @returns ps: @PersonData
   */
  public toJson(): PersonData {
    const ps: PersonData = {
      id_person: this.id_person,
      name: this.name,
      email: this.email,
      phone: this.phone,
      birth_date: Helper.nullForEmpty(this.birth_date),
      cpf: Helper.nullForEmpty(this.cpf),
      address: Helper.nullForEmpty(this.address),
      city: Helper.nullForEmpty(this.city),
      state: Helper.nullForEmpty(this.state),
    };

    return ps;
  }

  /**
   * Validate data for person
   * @returns response: @ResponseData
   */
  public validate(): ResponseData {
    let response: ResponseData;
    try {
      if ("" === this._name) throw new Error("Informe o nome da pessoa");
      if ("" === this._email) throw new Error("Informe o email da pessoa");
      if ("" === this._phone) throw new Error("Informe o telefone da pessoa");

      if (100 < this._name.length) throw new Error("Tamanho máximo do nome é 100 caracteres");
      if (50 < this._email.length) throw new Error("Tamanho máximo do emmail é 50 caracteres");
      if (20 < this._phone.length) throw new Error("Tamanho máximo do telefone é 20 caracteres");
      if (14 < this._cpf.length) throw new Error("Tamanho máximo do cpf é 14 caracteres");
      if (100 < this._address.length)
        throw new Error("Tamanho máximo do endereço é 100 caracteres");
      if (100 < this._city.length) throw new Error("Tamanho máximo do cidade é 100 caracteres");
      if (100 < this._state.length) throw new Error("Tamanho máximo do estado é 100 caracteres");
      if ("" != this._birth_date) {
        let b_date: Date = new Date(this._birth_date);
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
          message: (e as Error)?.message ?? "Erro grave ao validar dados da pessoa",
        },
      };
    }
    return response;
  }
}
