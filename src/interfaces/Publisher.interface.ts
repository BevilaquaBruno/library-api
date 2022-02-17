/**
 * Interfaces for publisher
 */

import { CountryData } from "./Country.interface";

/**
 * @PublisherData
 * Interface for publisher pattern data
 */
export interface PublisherData {
  id: number;
  name: string;
  cnpj: string;
  country: CountryData
}
