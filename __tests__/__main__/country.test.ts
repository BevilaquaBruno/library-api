import Country from "../../src/classes/Country.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import CountryFetch from "../__fetches__/country.fetch";

var responseExpected: ResponseData;
var countryTest = new Country("Country Test", "Country Test's full name", "CTT", "country.flag", 2);
const brazilExpected: Country = new Country(
  "Brasil",
  "República Federativa do Brasil",
  "BRA",
  "brasil_flag.png",
  1
);

describe("Testing Country", () => {
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "País cadastrado",
      },
    };
    const token: string = (await AuthFetch.login()).data.data.token;
    const response: ResponseData = (await CountryFetch.create(token, countryTest)).data;

    countryTest.id = response.data.id;
    responseExpected.data = countryTest.toJson();

    expect(response).toEqual(responseExpected);
  });

  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "País atualizado" },
    };

    const token: string = (await AuthFetch.login()).data.data.token;

    countryTest.name = "Country Test name updated";
    countryTest.fullName = "Country Test fullName updated";
    countryTest.short = "CTR";
    countryTest.flag = "Country Test flag updated";

    responseExpected.data = countryTest.toJson();
    const response: ResponseData = (await CountryFetch.update(token, countryTest)).data;

    expect(response).toEqual(responseExpected);
  });

  it("Find one", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "País encontrado",
      },
    };

    const responseBrazil: ResponseData = (await CountryFetch.findById(brazilExpected.id)).data;
    let brazil: Country = new Country(
      responseBrazil.data.name,
      responseBrazil.data.fullName,
      responseBrazil.data.short,
      responseBrazil.data.flag,
      responseBrazil.data.id
    );

    expect(responseBrazil.status).toEqual(responseExpected.status);
    expect(brazil).toEqual(brazilExpected);
  });

  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos os países",
      },
    };

    const response: ResponseData = (await CountryFetch.findAll()).data;
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

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

  it("Delete", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "País removido",
      },
    };

    const token: string = (await AuthFetch.login()).data.data.token;

    const response: ResponseData = (await CountryFetch.delete(token, countryTest.id)).data;
    expect(response).toEqual(responseExpected);
  });
});
