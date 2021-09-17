import md5 from "md5";
import User from "../../src/classes/User.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import UserFetch from "../__fetches__/user.fetch";

var responseExpected: ResponseData;
const userTestPassword = "123";
var userTest = new User("user Test", "user_test", "user@test.com", 2);
const bevilaquaExpected = new User(
  "Bruno Fernando Bevilaqua",
  "bevilaqua",
  "bbbevilaqua@gmail.com",
  1
);

userTest.password = md5(userTestPassword);

describe("Testing User", () => {
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Usuário cadastrado",
      },
    };
    const token = (await AuthFetch.login()).data.data.token;
    const password = "123";
    const passwordConfirm = "123";
    const response: ResponseData = (
      await UserFetch.create(token, userTest, password, passwordConfirm)
    ).data;

    userTest.id = response.data.id;
    responseExpected.data = userTest.toJson();

    expect(response).toEqual(responseExpected);
  });

  it("Find one", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Usuário encontrado",
      },
    };

    const token = (await AuthFetch.login()).data.data.token;

    const responseBevilaqua: ResponseData = (await UserFetch.findById(token, bevilaquaExpected.id))
      .data;
    let bevilaqua = new User(
      responseBevilaqua.data.name,
      responseBevilaqua.data.username,
      responseBevilaqua.data.email,
      responseBevilaqua.data.id
    );

    expect(responseBevilaqua.status).toEqual(responseExpected.status);
    expect(bevilaqua).toEqual(bevilaquaExpected);
  });

  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos os usuários",
      },
    };

    const token = (await AuthFetch.login()).data.data.token;

    const response: ResponseData = (await UserFetch.findAll(token)).data;
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

    response.data.forEach((currentUser: any) => {
      if (1 === currentUser?.id) {
        let bevilaqua = new User(
          currentUser.name,
          currentUser.username,
          currentUser.email,
          currentUser.id
        );
        expect(bevilaqua).toEqual(bevilaquaExpected);
      }
    });
  });

  it("Delete", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Usuário removido",
      },
    };

    const token = (await AuthFetch.login()).data.data.token;

    const response: ResponseData = (await UserFetch.delete(token, userTest.id)).data;
    expect(response).toEqual(responseExpected);
  });
});
