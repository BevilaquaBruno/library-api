/**
 * Interfaces for publisher
 */

import Country from "../classes/Country.class";

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
