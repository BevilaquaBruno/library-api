import Idiom from "../../src/classes/Idiom.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import IdiomFetch from "../__fetches__/idiom.fetch";

/**
 * Testing for all idiom routes
 */

var responseExpected: ResponseData;
// creating a temp idiom
var idiomTest = new Idiom("Idiom test", 2);
// the expected from Portugues idiom
const portuguesExpected: Idiom = new Idiom("Português Brasileiro", 1);

describe("Testing Idiom", () => {
  /**
   * Testing idiom route
   */
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Idioma cadastrado",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;
    //2. executes url
    const response: ResponseData = (await IdiomFetch.create(token, idiomTest)).data;

    //3. set the id to test country
    idiomTest.id = response.data.id;
    responseExpected.data = idiomTest.toJson();
    //4. validate expected result
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update route
   */
  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "Idioma atualizado" },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. update country data
    idiomTest.description = "Idiom Test description updated";

    responseExpected.data = idiomTest.toJson();
    //3. execute url
    const response: ResponseData = (await IdiomFetch.update(token, idiomTest)).data;

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
        message: "Idioma encontrado",
      },
    };
    //1. executes url and create a new country
    const responsePortugues: ResponseData = (await IdiomFetch.findById(portuguesExpected.id)).data;
    let portuguesBrasileiro: Idiom = new Idiom(responsePortugues.data.description, responsePortugues.data.id);

    //2. validate the expected Portugues
    expect(responsePortugues.status).toEqual(responseExpected.status);
    expect(portuguesBrasileiro).toEqual(portuguesExpected);
  });

  /**
   * Testing find all route
   */
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos os idiomas",
      },
    };
    //1. execute url
    const response: ResponseData = (await IdiomFetch.findAll()).data;
    //2. validate status and number of countries
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

    //3. find Brasil in list and validate him
    response.data.forEach((currentIdiom: any) => {
      if (1 === currentIdiom?.id) {
        let portuguesBrasileiro: Idiom = new Idiom(currentIdiom.description, currentIdiom.id);
        expect(portuguesBrasileiro).toEqual(portuguesExpected);
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
        message: "Idioma removido",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url
    const response: ResponseData = (await IdiomFetch.delete(token, idiomTest.id)).data;
    //3. validate expetected response
    expect(response).toEqual(responseExpected);
  });
});
