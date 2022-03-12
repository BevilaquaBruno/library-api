import { ResponseData } from "../interfaces/Common.interface";
import { PersonData } from "../interfaces/Person.interface";
import validator from "validator";

export default class Person {
  /**
   * Attributtes
   */
  private _id_person: number;
  private _name: string;
  private _email: string;
  private _phone: string;
  private _birth_date: string | null;
  private _cpf: string | null;
  private _address: string | null;
  private _city: string | null;
  private _state: string | null;

  constructor(
    name: string = "",
    email: string = "",
    phone: string = "",
    birth_date: string | null = null,
    cpf: string | null = null,
    address: string | null = null,
    city: string | null = null,
    state: string | null = null,
    id: number = 0
  ) {
    this._name = name;
    this._email = email;
    this._phone = phone;
    this._birth_date = "" === birth_date ? null : birth_date;
    this._cpf = "" === cpf ? null : cpf;
    this._address = "" === address ? null : address;
    this._city = "" === city ? null : city;
    this._state = "" === state ? null : state;
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

  public get birth_date(): string | null {
    return this._birth_date;
  }

  public get cpf(): string | null {
    return this._cpf;
  }

  public get address(): string | null {
    return this._address;
  }

  public get city(): string | null {
    return this._city;
  }

  public get state(): string | null {
    return this._state;
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

  public set birth_date(v: string | null) {
    this._birth_date = "" === v ? null : v;
  }

  public set cpf(v: string | null) {
    this._cpf = "" === v ? null : v;
  }

  public set address(v: string | null) {
    this._address = "" === v ? null : v;
  }

  public set city(v: string | null) {
    this._city = "" === v ? null : v;
  }

  public set state(v: string | null) {
    this._state = "" === v ? null : v;
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
      birth_date: this.birth_date,
      cpf: this.cpf,
      address: this.address,
      city: this.city,
      state: this.state,
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
      if ("" === this.name) throw new Error("Informe o nome da pessoa");
      if ("" === this.email) throw new Error("Informe o email da pessoa");
      if ("" === this.phone) throw new Error("Informe o telefone da pessoa");

      if (100 < this.name.length) throw new Error("Tamanho máximo do nome é 100 caracteres");
      if (50 < this.email.length) throw new Error("Tamanho máximo do emmail é 50 caracteres");
      if (20 < this.phone.length) throw new Error("Tamanho máximo do telefone é 20 caracteres");
      if (null != this.cpf) {
        if (14 < this.cpf.length) throw new Error("Tamanho máximo do cpf é 14 caracteres");
      }
      if (null != this.address) {
        if (100 < this.address.length)
          throw new Error("Tamanho máximo do endereço é 100 caracteres");
      }
      if (null != this.city) {
        if (100 < this.city.length) throw new Error("Tamanho máximo do cidade é 100 caracteres");
      }
      if (null != this.state) {
        if (100 < this.state.length) throw new Error("Tamanho máximo do estado é 100 caracteres");
      }
      if (null != this.birth_date) {
        let b_date: Date = new Date(this.birth_date);
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
