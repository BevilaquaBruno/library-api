import { ResponseData } from "../../src/interfaces/Common.interface";
import { login, logout } from "../__fetches__/auth.fetch";

var responseExpected: ResponseData;

describe("Testing Auth", () => {
  it("Logout", async () => {
    responseExpected = {
      data: { token: null },
      status: { error: false, message: "Logout efetuado com sucesso" },
    };

    const response: ResponseData = (await logout()).data;

    expect(response).toEqual(responseExpected);
  });

  it("Login with bevilaqua:123", async () => {
    responseExpected = {
      data: { token: "???" },
      status: { error: false, message: "Usuário logado com sucesso" },
    };

    const response: ResponseData = (await login()).data;

    expect(response.status).toEqual(responseExpected.status);
    expect(response.data.token).not.toBe("");
    expect(response.data.token).not.toBe(null);
    expect(response.data.token).not.toBe(undefined);
  });
});
