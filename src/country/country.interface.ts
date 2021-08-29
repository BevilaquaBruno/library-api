export interface BaseCountry {
  name: string,
  full_name: string,
  short: string,
  flag: string
}

export interface Country extends BaseCountry {
  id: number
}