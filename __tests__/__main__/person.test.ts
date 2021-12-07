import Person from "../../src/classes/Person.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import PersonFetch from "../__fetches__/person.fetch";

/**
 * Testing for all person routes
 */

var responseExpected: ResponseData;
// create a temp person
var personTest = new Person(
  "Person Test name",
  "perseon@test.com",
  "49998320023",
  "2000-03-05",
  "072.043.129-88",
  "adddress",
  "city",
  "state",
  2
);
// create me to test
const bevilaquaExpected: Person = new Person(
  "Bruno Fernando Bevilaqua",
  "bbbevilaqua2@gmail.com",
  "5549998320023",
  "2000-03-05",
  "103.411.729-79",
  "",
  "",
  "",
  1
);

describe("Testing Person", () => {
  /**
   * Testing create route
   */
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Pessoa cadastrada",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;
    //2. execute url
    const response: ResponseData = (await PersonFetch.create(token, personTest)).data;

    //3. set id_person in personTest and retrieve data
    personTest.id_person = response.data.id_person;
    responseExpected.data = personTest.toJson();

    //4. validate expected data
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update route
   */
  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "Pessoa atualizada" },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. update person data
    personTest.name = "Person updated";
    personTest.email = "personbbbevilaqua@gmail.com";

    responseExpected.data = personTest.toJson();
    //3. execute url
    const response: ResponseData = (await PersonFetch.update(token, personTest)).data;

    //4. validate data expected
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
        message: "Pessoa encontrada",
      },
    };
    //1. execute url to find bevilaqua
    const responseBevilaqua: ResponseData = (
      await PersonFetch.findById(bevilaquaExpected.id_person)
    ).data;
    let bevilaqua: Person = new Person(
      responseBevilaqua.data.name,
      responseBevilaqua.data.email,
      responseBevilaqua.data.phone,
      responseBevilaqua.data.birth_date,
      responseBevilaqua.data.cpf,
      responseBevilaqua.data.address,
      responseBevilaqua.data.city,
      responseBevilaqua.data.state,
      responseBevilaqua.data.id_person
    );
    //2. validate bevilaqua expected
    expect(responseBevilaqua.status).toEqual(responseExpected.status);
    expect(bevilaqua.toJson()).toEqual(bevilaquaExpected.toJson());
  });

  /**
   * Testing find all route
   */
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todas as pessoas",
      },
    };

    //1. execute url and validate status and data length
    const response: ResponseData = (await PersonFetch.findAll()).data;
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

    //2. in list find bevilaqua and validate him
    response.data.forEach((currentPerson: any) => {
      if (1 === currentPerson?.id) {
        let bevilaqua: Person = new Person(
          currentPerson.name,
          currentPerson.email,
          currentPerson.phone,
          currentPerson.birth_date,
          currentPerson.cpf,
          currentPerson.adddress,
          currentPerson.city,
          currentPerson.state,
          currentPerson.id_person
        );
        expect(bevilaqua.toJson()).toEqual(bevilaquaExpected.toJson());
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
        message: "Pessoa removida",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url and validate expected data
    const response: ResponseData = (await PersonFetch.delete(token, personTest.id_person)).data;
    expect(response).toEqual(responseExpected);
  });
});
