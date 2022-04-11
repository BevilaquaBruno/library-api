import Style from "../../src/classes/Style.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import StyleFetch from "../__fetches__/style.fetch";

/**
 * Testing for all style routes
 */

var responseExpected: ResponseData;
// creating a temp style
var styleTest = new Style("Style test", 2);
// the expected from Livro style
const livroExpected: Style = new Style("Livro", 1);

describe("Testing Style", () => {
  /**
   * Testing style route
   */
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Tipo cadastrado",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;
    //2. executes url
    const response: ResponseData = (await StyleFetch.create(token, styleTest)).data;

    //3. set the id to test country
    styleTest.id = response.data.id;
    responseExpected.data = styleTest.toJson();
    //4. validate expected result
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update route
   */
  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "Tipo atualizado" },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. update country data
    styleTest.description = "Style Test description updated";

    responseExpected.data = styleTest.toJson();
    //3. execute url
    const response: ResponseData = (await StyleFetch.update(token, styleTest)).data;

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
        message: "Tipo encontrado",
      },
    };
    //1. executes url and create a new country
    const responseLivro: ResponseData = (await StyleFetch.findById(livroExpected.id)).data;
    let livro: Style = new Style(responseLivro.data.description, responseLivro.data.id);

    //2. validate the expected Livro
    expect(responseLivro.status).toEqual(responseExpected.status);
    expect(livro).toEqual(livroExpected);
  });

  /**
   * Testing find all route
   */
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos os tipos",
      },
    };
    //1. execute url
    const response: ResponseData = (await StyleFetch.findAll()).data;
    //2. validate status and number of countries
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

    //3. find Brasil in list and validate him
    response.data.forEach((currentStyle: any) => {
      if (1 === currentStyle?.id) {
        let livro: Style = new Style(currentStyle.description, currentStyle.id);
        expect(livro).toEqual(livroExpected);
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
        message: "Tipo removido",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url
    const response: ResponseData = (await StyleFetch.delete(token, styleTest.id)).data;
    //3. validate expetected response
    expect(response).toEqual(responseExpected);
  });
});
