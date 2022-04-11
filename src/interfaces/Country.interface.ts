/**
 * Interfaces for country
 */

/**
 * @CountryData
 * Interface for country pattern data
 */
export interface CountryData {
  id: number;
  name: string;
  fullName: string | null;
  short: string;
  flag: string | null;
}
