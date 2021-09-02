import Country from "../classes/Country.class";
/**
 * Interfaces for country
 */
export interface CountryList {
    [key: number]: Country;
}

export interface CountryData {
    id: number;
    name: string;
    fullName: string;
    short: string;
    flag: string;
}