import Country from "../../src/classes/Country.class";
import Publisher from "../../src/classes/Publisher.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import PublisherFetch from "../__fetches__/publisher.fetch";

/**
 * Testing for all publisher routes
 */

var responseExpected: ResponseData;
// creating a temp publisher
var publisherTest = new Publisher(
  "Publisher test",
  new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
  2
);
// the expected from companhia das letras publisher
const ciaDasLetrasExpected: Publisher = new Publisher(
  "Companhia das Letras",
  new Country("Brasil", "República Federativa do Brasil", "BRA", "brasil_flag.png", 1),
  1
);

describe("Testing Publisher", () => {
  /**
   * Testing publisher route
   */
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Editora cadastrada",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;
    //2. executes url
    const response: ResponseData = (await PublisherFetch.create(token, publisherTest)).data;

    //3. set the id to test publisher
    publisherTest.id = response.data.id;
    responseExpected.data = publisherTest.toJson();
    //4. validate expected result
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update route
   */
  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "Editora atualizada" },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. update publisher data
    publisherTest.name = "Publisher Test name updated";

    responseExpected.data = publisherTest.toJson();
    //3. execute url
    const response: ResponseData = (await PublisherFetch.update(token, publisherTest)).data;

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
        message: "Editora encontrada",
      },
    };
    //1. executes url and create a new country
    const responseCiaDasLetras: ResponseData = (
      await PublisherFetch.findById(ciaDasLetrasExpected.id)
    ).data;
    let ciadasLetras: Publisher = new Publisher(
      responseCiaDasLetras.data.name,
      new Country(
        responseCiaDasLetras.data.country.name,
        responseCiaDasLetras.data.country.fullName,
        responseCiaDasLetras.data.country.short,
        responseCiaDasLetras.data.country.flag,
        responseCiaDasLetras.data.country.id
      ),
      responseCiaDasLetras.data.id
    );

    //2. validate the expected companhia das letras
    expect(responseCiaDasLetras.status).toEqual(responseExpected.status);
    expect(ciadasLetras).toEqual(ciaDasLetrasExpected);
  });

  /**
   * Testing find all route
   */
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos as editoras",
      },
    };
    //1. execute url
    const response: ResponseData = (await PublisherFetch.findAll()).data;
    //2. validate status and number of countries
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

    //3. find Brasil in list and validate him
    response.data.forEach((currentPublisher: any) => {
      if (1 === currentPublisher?.id) {
        let ciadasLetras: Publisher = new Publisher(
          currentPublisher.name,
          new Country(
            currentPublisher.country.name,
            currentPublisher.country.fullName,
            currentPublisher.country.short,
            currentPublisher.country.flag,
            currentPublisher.country.id
          ),
          currentPublisher.id
        );
        expect(ciadasLetras).toEqual(ciaDasLetrasExpected);
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
        message: "Editora removida",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url
    const response: ResponseData = (await PublisherFetch.delete(token, publisherTest.id)).data;
    //3. validate expetected response
    expect(response).toEqual(responseExpected);
  });
});
