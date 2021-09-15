import * as dotenv from "dotenv";
import axios, { AxiosResponse } from "axios";
import Country from "../../src/classes/Country.class";

dotenv.config();

export const create = async (token: string, country: Country): Promise<AxiosResponse> => {
  return await axios({
    method: "POST",
    url: "http://localhost:" + process.env.PORT + "/api/country",
    responseType: "json",
    headers: {
      "x-access-token": token,
    },
    data: {
      name: country.name,
      fullName: country.fullName,
      short: country.short,
      flag: country.flag,
    },
  });
};

export const update = async (token: string, country: Country) => {
  return await axios({
    method: "PUT",
    url: "http://localhost:" + process.env.PORT + "/api/country/" + country.id,
    responseType: "json",
    headers: {
      "x-access-token": token,
    },
    data: {
      name: country.name,
      fullName: country.fullName,
      short: country.short,
      flag: country.flag,
    },
  });
};

export const remove = async (token: string, id: number) => {
  return await axios({
    method: "DELETE",
    url: "http://localhost:" + process.env.PORT + "/api/country/" + id,
    responseType: "json",
    headers: {
      "x-access-token": token,
    },
  });
};

export const findAll = async (): Promise<AxiosResponse> => {
  return await axios({
    method: "GET",
    url: "http://localhost:" + process.env.PORT + "/api/country",
    responseType: "json",
  });
};

export const find = async (id: number): Promise<AxiosResponse> => {
  return await axios({
    method: "GET",
    url: "http://localhost:" + process.env.PORT + "/api/country/" + id,
    responseType: "json",
  });
};
