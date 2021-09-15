import Country from "../../src/classes/Country.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import { login } from "../__fetches__/auth.fetch";
import { create, update, remove, findAll, find } from "../__fetches__/country.fetch";

var responseExpected: ResponseData;
var countryTest = new Country("Country Test", "Country Test's full name", "CTT", "country.flag");
const brazilExpected = new Country(
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
    const token = (await login()).data.data.token;
    const response: ResponseData = (await create(token, countryTest)).data;

    countryTest.id = response.data.id;
    responseExpected.data = countryTest.toJson();

    await expect(response).toEqual(responseExpected);
  });

  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "País atualizado" },
    };

    const token = (await login()).data.data.token;

    countryTest.name = "Country Test name updated";
    countryTest.fullName = "Country Test fullName updated";
    countryTest.short = "CTR";
    countryTest.flag = "Country Test flag updated";

    responseExpected.data = countryTest.toJson();
    const response: ResponseData = (await update(token, countryTest)).data;

    await expect(response).toEqual(responseExpected);
  });

  it("Find one", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "País encontrado",
      },
    };

    const responseBrazil: ResponseData = (await find(brazilExpected.id)).data;
    let brazil = new Country(
      responseBrazil.data.name,
      responseBrazil.data.fullName,
      responseBrazil.data.short,
      responseBrazil.data.flag,
      responseBrazil.data.id
    );

    const response: ResponseData = (await find(countryTest.id)).data;
    let test = new Country(
      response.data.name,
      response.data.fullName,
      response.data.short,
      response.data.flag,
      response.data.id
    );

    await expect(responseBrazil.status).toEqual(responseExpected.status);
    await expect(brazil).toEqual(brazilExpected);

    await expect(response.status).toEqual(responseExpected.status);
    await expect(test).toEqual(countryTest);
  });

  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos os países",
      },
    };

    const response: ResponseData = (await findAll()).data;
    await expect(response.status).toEqual(responseExpected.status);
    await expect(response.data.length).not.toEqual(0);

    response.data.forEach((currentCountry: any) => {
      if (1 === currentCountry?.id) {
        let brazil = new Country(
          currentCountry.name,
          currentCountry.fullName,
          currentCountry.short,
          currentCountry.flag,
          currentCountry.id
        );
        expect(brazil).toEqual(brazilExpected);
      } else if (countryTest.id === currentCountry.id) {
        let test = new Country(
          currentCountry.name,
          currentCountry.fullName,
          currentCountry.short,
          currentCountry.flag,
          currentCountry.id
        );
        expect(test).toEqual(countryTest);
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

    const token = (await login()).data.data.token;

    const response: ResponseData = (await remove(token, countryTest.id)).data;
    await expect(response).toEqual(responseExpected);
  });
});
