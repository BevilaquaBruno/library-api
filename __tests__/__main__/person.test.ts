import Person from "../../src/classes/Person.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import PersonFetch from "../__fetches__/person.fetch";

var responseExpected: ResponseData;
var personTest = new Person(
  "Person Test name",
  "perseon@test.com",
  "49998320023",
  "2000-03-05",
  "103.411.729-79",
  "adddress",
  "city",
  "state",
  2
);
const bevilaquaExpected: Person = new Person(
  "Bruno Fernando Bevilaqua",
  "bbbevilaqua@gmail.com",
  "5549998320023",
  "2000-03-05",
  "103.411.729-79",
  "",
  "",
  "",
  1
);

describe("Testing Person", () => {
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todas as pessoas",
      },
    };

    const response: ResponseData = (await PersonFetch.findAll()).data;
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

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
          currentPerson.id
        );
        expect(bevilaqua.toJson()).toEqual(bevilaquaExpected.toJson());
      }
    });
  });
});