import { response } from "express";
import md5 from "md5";
import User from "../../src/classes/User.class";
import { ResponseData } from "../../src/interfaces/Common.interface";
import { PasswordList } from "../../src/interfaces/User.interface";
import AuthFetch from "../__fetches__/auth.fetch";
import UserFetch from "../__fetches__/user.fetch";

/**
 * Testing for all user routes
 */

var responseExpected: ResponseData;
// user test password
const userTestPassword: string = "123";
// user test
var userTest: User = new User("user Test", "user_test", "user@test.com", 2);
// my user
const bevilaquaExpected: User = new User(
  "Bruno Fernando Bevilaqua",
  "bevilaqua",
  "bbbevilaqua@gmail.com",
  1
);
// encrypting password
userTest.password = md5(userTestPassword);
describe("Testing User", () => {
  /**
   * Testing create route
   */
  it("Create", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Usuário cadastrado",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;
    //2. create the password list
    const passwordList: PasswordList = {
      password: "123",
      passwordConfirm: "123",
    };
    //3. executes url
    const response: ResponseData = (await UserFetch.create(token, userTest, passwordList)).data;

    //4. set user id
    userTest.id = response.data.id;
    responseExpected.data = userTest.toJson();

    //5. validate response
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update password route
   */
  it("Update Password", async () => {
    responseExpected = {
      data: userTest.toJson(),
      status: { error: false, message: "Senha do usuário atualizada" },
    };

    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. create password list
    const passwordList: PasswordList = {
      password: "1234",
      passwordConfirm: "1234",
    };
    //3. execute url and validate response
    const response: ResponseData = (
      await UserFetch.updatePassword(token, userTest.id, passwordList)
    ).data;
    expect(response).toEqual(responseExpected);
  });

  /**
   * Testing update route
   */
  it("Update", async () => {
    responseExpected = {
      data: {},
      status: { error: false, message: "Usuário atualizado" },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. update user data
    userTest.name = "User Test 2";
    userTest.username = "usertest2";
    userTest.email = "usertes2@test2.com";

    //3. execute url
    responseExpected.data = userTest.toJson();
    const response: ResponseData = (await UserFetch.update(token, userTest)).data;

    //4. validate response
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
        message: "Usuário encontrado",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url
    const responseBevilaqua: ResponseData = (await UserFetch.findById(token, bevilaquaExpected.id))
      .data;
    let bevilaqua: User = new User(
      responseBevilaqua.data.name,
      responseBevilaqua.data.username,
      responseBevilaqua.data.email,
      responseBevilaqua.data.id
    );

    //3. validate response
    expect(responseBevilaqua.status).toEqual(responseExpected.status);
    expect(bevilaqua).toEqual(bevilaquaExpected);
  });

  /**
   * Testing find all route
   */
  it("Find all", async () => {
    responseExpected = {
      data: {},
      status: {
        error: false,
        message: "Lista de todos os usuários",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url and validate status and data length
    const response: ResponseData = (await UserFetch.findAll(token)).data;
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.length).not.toEqual(0);

    //3. find my user and validate him
    response.data.forEach((currentUser: any) => {
      if (1 === currentUser?.id) {
        let bevilaqua: User = new User(
          currentUser.name,
          currentUser.username,
          currentUser.email,
          currentUser.id
        );
        expect(bevilaqua).toEqual(bevilaquaExpected);
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
        message: "Usuário removido",
      },
    };
    //1. get the token
    const token: string = (await AuthFetch.login()).data.data.token;

    //2. execute url and validate response
    const response: ResponseData = (await UserFetch.delete(token, userTest.id)).data;
    expect(response).toEqual(responseExpected);
  });
});
