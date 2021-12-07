import Country from "../../src/classes/Country.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import CountryFetch from "../__fetches__/country.fetch";

/**
 * Testing for all country routes
 */

var responseExpected: ResponseData;
// creating a temp country
var countryTest = new Country("Country Test", "Country Test's full name", "CTT", "country.flag", 2);
// the expected from Brasil country
const brazilExpected: Country = new Country(
  "Brasil",
  "República Federativa do Brasil",
  "BRA",
  "brasil_flag.png",
  1
);

describe("Testing Country", () => {
  /**
   * Testing create route
   */
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "País cadastrado",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;
    //2. executes url
    const response: ResponseData = (await CountryFetch.create(token, countryTest)).data;

    //3. set the id to test country
    countryTest.id = response.data.id;
    responseExpected.data = countryTest.toJson();
    //4. validate expected result
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update route
   */
  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "País atualizado" },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. update country data
    countryTest.name = "Country Test name updated";
    countryTest.fullName = "Country Test fullName updated";
    countryTest.short = "CTR";
    countryTest.flag = "Country Test flag updated";

    responseExpected.data = countryTest.toJson();
    //3. execute url
    const response: ResponseData = (await CountryFetch.update(token, countryTest)).data;

    //4. validate expected data
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing find one route
   */
  it("Find one", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "País encontrado",
      },
    };
    //1. executes url and create a new country
    const responseBrazil: ResponseData = (await CountryFetch.findById(brazilExpected.id)).data;
    let brazil: Country = new Country(
      responseBrazil.data.name,
      responseBrazil.data.fullName,
      responseBrazil.data.short,
      responseBrazil.data.flag,
      responseBrazil.data.id
    );

    //2. validate the expected Brasil
    expect(responseBrazil.status).toEqual(responseExpected.status);
    expect(brazil).toEqual(brazilExpected);
  });

  /**
   * Testing find all route
   */
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos os países",
      },
    };
    //1. execute url
    const response: ResponseData = (await CountryFetch.findAll()).data;
    //2. validate status and number of countries
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

    //3. find Brasil in list and validate him
    response.data.forEach((currentCountry: any) => {
      if (1 === currentCountry?.id) {
        let brazil: Country = new Country(
          currentCountry.name,
          currentCountry.fullName,
          currentCountry.short,
          currentCountry.flag,
          currentCountry.id
        );
        expect(brazil).toEqual(brazilExpected);
      }
    });
  });

  /**
   * Testing delete route
   */
  it("Delete", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "País removido",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url
    const response: ResponseData = (await CountryFetch.delete(token, countryTest.id)).data;
    //3. validate expetected response
    expect(response).toEqual(responseExpected);
  });
});
