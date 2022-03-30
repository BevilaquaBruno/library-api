import Genre from "../../src/classes/Genre.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import GenreFetch from "../__fetches__/genre.fetch";

/**
 * Testing for all genre routes
 */

var responseExpected: ResponseData;
// creating a temp genre
var genreTest = new Genre("Genre test", 2);
// the expected from Romance genre
const romanceExpected: Genre = new Genre("Romance", 1);

describe("Testing Genre", () => {
  /**
   * Testing genre route
   */
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Gênero cadastrado",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;
    //2. executes url
    const response: ResponseData = (await GenreFetch.create(token, genreTest)).data;

    //3. set the id to test genre
    genreTest.id = response.data.id;
    responseExpected.data = genreTest.toJson();
    //4. validate expected result
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update route
   */
  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "Gênero atualizado" },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. update genre data
    genreTest.description = "Genre Test description updated";

    responseExpected.data = genreTest.toJson();
    //3. execute url
    const response: ResponseData = (await GenreFetch.update(token, genreTest)).data;

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
        message: "Gênero encontrado",
      },
    };
    //1. executes url and create a new genre
    const responsePortugues: ResponseData = (await GenreFetch.findById(romanceExpected.id)).data;
    let romanceBrasileiro: Genre = new Genre(responsePortugues.data.description, responsePortugues.data.id);

    //2. validate the expected Portugues
    expect(responsePortugues.status).toEqual(responseExpected.status);
    expect(romanceBrasileiro).toEqual(romanceExpected);
  });

  /**
   * Testing find all route
   */
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos os gêneros",
      },
    };
    //1. execute url
    const response: ResponseData = (await GenreFetch.findAll()).data;
    //2. validate status and number of countries
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

    //3. find Brasil in list and validate him
    response.data.forEach((currentGenre: any) => {
      if (1 === currentGenre?.id) {
        let romanceBrasileiro: Genre = new Genre(currentGenre.description, currentGenre.id);
        expect(romanceBrasileiro).toEqual(romanceExpected);
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
        message: "Gênero removido",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url
    const response: ResponseData = (await GenreFetch.delete(token, genreTest.id)).data;
    //3. validate expetected response
    expect(response).toEqual(responseExpected);
  });
});
