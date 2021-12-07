import { ResponseData } from "../../src/interfaces/Common.interface";
import AuthFetch from "../__fetches__/auth.fetch";

/**
 * Testing for all auth routes
 */
var responseExpected: ResponseData;

describe("Testing Auth", () => {
  /**
   * testing logout route
   */
  it("Logout", async () => {
    responseExpected = {
      data: { token: null },
      status: { error: false, message: "Logout efetuado com sucesso" },
    };
    //1. Execute the route and get response
    const response: ResponseData = (await AuthFetch.logout()).data;
    //2. validate response with the expected
    expect(response).toEqual(responseExpected);
  });

  /**
   * testing login route
   */
  it("Login with bevilaqua:123", async () => {
    responseExpected = {
      data: { token: "???" },
      status: { error: false, message: "Usuário logado com sucesso" },
    };
    //1. try to login with the user and password configured
    const response: ResponseData = (await AuthFetch.login()).data;

    /**
     * 2. Validate status
     * validate token in 3 ways
     */
    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.token).not.toBe("");
    expect(response.data.token).not.toBe(null);
    expect(response.data.token).not.toBe(undefined);
  });
});
