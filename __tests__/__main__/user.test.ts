import { response } from "express";
import md5 from "md5";
import User from "../../src/classes/User.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import { PasswordList } from "../../src/interfaces/User.interface";
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
    const passwordList: PasswordList = {
      password: "123",
      passwordConfirm: "123",
    };
    const response: ResponseData = (await UserFetch.create(token, userTest, passwordList)).data;

    userTest.id = response.data.id;
    responseExpected.data = userTest.toJson();

    expect(response).toEqual(responseExpected);
  });

  it("Update Password", async () => {
    responseExpected = {
      data: userTest.toJson(),
      status: { error: false, message: "Senha do usuário atualizada" },
    };

    const token = (await AuthFetch.login()).data.data.token;

    const passwordList: PasswordList = {
      password: "1234",
      passwordConfirm: "1234",
    };
    const response: ResponseData = (
      await UserFetch.updatePassword(token, userTest.id, passwordList)
    ).data;
    expect(response).toEqual(responseExpected);
  });

  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "Usuário atualizado" },
    };

    const token = (await AuthFetch.login()).data.data.token;

    userTest.name = "User Test 2";
    userTest.username = "usertest2";
    userTest.email = "usertes2@test2.com";

    responseExpected.data = userTest.toJson();
    const response: ResponseData = (await UserFetch.update(token, userTest)).data;

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
