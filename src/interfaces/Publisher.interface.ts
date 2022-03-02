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
