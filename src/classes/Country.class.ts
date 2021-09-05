import { CountryData } from "../interfaces/Country.interface";

export default class Country {
  /**
   * Attributes
   */
  private _id: number;
  private _name: string;
  private _fullName: string;
  private _short: string;
  private _flag: string;

  /**
   *
   * @param id id of the table in the table country
   * @param name name of the coutry e.g.: Brasil
   * @param fullName full name of the country e.g.: República Federativa do Brasil
   * @param short short of the country e.g.: BRA
   * @param flag flag file of the country e.g.: brasil_flag.png
   */
  constructor(name: string = '', fullName: string = '', short: string = '', flag: string = '', id: number = 0) {
    this._id = id;
    this._name = name;
    this._fullName = fullName;
    this._short = short;
    this._flag = flag;
  }

  /**
   * Getters
   */
  public get id() : number {
      return this._id;
  }

  public get name() : string {
      return this._name;
  }

  public get fullName() : string {
      return this._fullName;
  }

  public get short() : string {
      return this._short;
  }

  public get flag() : string {
      return this._flag;
  }

  /**
   * Setters
   */
  public set id(v : number) {
      this._id = v;
  }

  public set name(v : string) {
      this._name = v;
  }

  public set fullName(v : string) {
      this._fullName = v;
  }

  public set short(v : string) {
      this._short = v;
  }

  public set flag(v : string) {
      this._flag = v;
  }

  /**
   * Methods
   */
  public toJson() {
    const ct: CountryData = {
      id: this._id,
      name: this._name,
      fullName: this._fullName,
      short: this._short,
      flag: this._flag
    }
    return ct;
  }
}