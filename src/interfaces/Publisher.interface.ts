/**
 * Interfaces for publisher
 */

import Country from "../classes/Country.class";
import { CountryData } from "./Country.interface";

/**
 * @PublisherData
 * Interface for publisher pattern data
 */
export interface PublisherData {
  id: number;
  name: string;
  country: Country;
}

/**
 * @PublisherDataInterfaces
 * Interface for final json
 */
export interface PublisherDataInterfaces {
  id: number;
  name: string;
  country: CountryData;
}

/**
 * @PublisherDataSQL
 * Interface for sql queries with publisher table
 */

export interface PublisherDataSQL {
  id: number;
  name: string;
  country_name: string;
  country_fullName: string;
  country_short: string;
  country_flag: string;
  country_id: number;
}
