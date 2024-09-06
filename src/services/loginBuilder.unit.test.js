import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

import { loginDBconsult } from "./loginDBconsult.js";
import { loginBuilder } from "./loginBuilder.js";

jest.mock("./loginDBconsult.js");

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockResolvedValue("tokenDeAcessoUser"),
}));

jest.mock("bcrypt", () => ({
  compare: jest
    .fn()
    .mockImplementation(
      (passwordReq, passwordDB) => passwordReq === passwordDB
    ),
}));

let identifier;
let password;
let accountType;

beforeEach(() => {
  jest.clearAllMocks();
  identifier = "555";
  password = "senha123";
  accountType = "user";
});

describe("checkAccountAndCreateToken: async (identifier, password, accountType) => {...}", () => {
  test("create a token with a valid user", async () => {
    loginDBconsult.getUserByEmail.mockResolvedValue({
      user: "Felps",
      id: 1,
      password: "senha123",
    });

    const token = await loginBuilder.checkAccountAndCreateToken(
      identifier,
      password,
      accountType
    );

    expect(token).toBe("tokenDeAcessoUser");
    expect(loginDBconsult.getUserByEmail).toHaveBeenCalledWith("555");
    expect(bcrypt.compare).toHaveBeenCalledWith("senha123", "senha123");
    expect(JWT.sign).toHaveBeenCalledWith(
      { isCompany: false, id: 1 },
      expect.any(String)
    );
  });

  test("create a token with a valid company", async () => {
    loginDBconsult.getCompanyByCNPJ.mockResolvedValue({
      company: "Empresa LTDA",
      id: 1,
      password: "senha123",
    });

    JWT.sign.mockResolvedValueOnce("tokenDeAcessoCompany");

    accountType = "company";

    const token = await loginBuilder.checkAccountAndCreateToken(
      identifier,
      password,
      accountType
    );

    expect(token).toBe("tokenDeAcessoCompany");
    expect(loginDBconsult.getCompanyByCNPJ).toHaveBeenCalledWith("555");
    expect(bcrypt.compare).toHaveBeenCalledWith("senha123", "senha123");
    expect(JWT.sign).toHaveBeenCalledWith(
      { isCompany: true, id: 1 },
      expect.any(String)
    );
  });

  test("create a token with an invalid account", async () => {
    loginDBconsult.getUserByEmail.mockResolvedValue({
      user: "Felps",
      id: 1,
      password: "senha123",
    });

    password = "senhaErrada";

    const token = await loginBuilder.checkAccountAndCreateToken(
      identifier,
      password,
      accountType
    );

    expect(token).toBe(false);
    expect(loginDBconsult.getUserByEmail).toHaveBeenCalledWith("555");
    expect(bcrypt.compare).toHaveBeenCalledWith("senhaErrada", "senha123");
    expect(JWT.sign).not.toHaveBeenCalled();
  });

  test("creating a token with a non-existent account", async () => {
    loginDBconsult.getUserByEmail.mockResolvedValue(null);

    const token = await loginBuilder.checkAccountAndCreateToken(
      identifier,
      password,
      accountType
    );

    expect(token).toBe(false);
    expect(loginDBconsult.getUserByEmail).toHaveBeenCalledWith("555");
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(JWT.sign).not.toHaveBeenCalled();
  });

  test("creating a token but an unexpected error occurs", async () => {
    loginDBconsult.getUserByEmail.mockRejectedValue(new Error());

    const token = await loginBuilder.checkAccountAndCreateToken(
      identifier,
      password,
      accountType
    );

    expect(token).toBeInstanceOf(Error);
    expect(loginDBconsult.getUserByEmail).toHaveBeenCalledWith("555");
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(JWT.sign).not.toHaveBeenCalled();
  });
});

describe("checkAccount: async (id, accountType) => {...}", () => {
  test("returns the correct account for a valid user ID", async () => {
    loginDBconsult.getUserById.mockResolvedValue({ id: 1, name: "User" });

    const account = await loginBuilder.checkAccount(1, "user");

    expect(account).toEqual({ id: 1, name: "User" });
    expect(loginDBconsult.getUserById).toHaveBeenCalledWith(1);
  });

  test("returns false for a non-existent user", async () => {
    loginDBconsult.getUserById.mockResolvedValue(null);

    const account = await loginBuilder.checkAccount(1, "user");

    expect(account).toBe(false);
    expect(loginDBconsult.getUserById).toHaveBeenCalledWith(1);
  });

  test("returns error if an unexpected error occurs", async () => {
    loginDBconsult.getUserById.mockRejectedValue(new Error());

    const account = await loginBuilder.checkAccount(1, "user");

    expect(account).toBeInstanceOf(Error);
    expect(loginDBconsult.getUserById).toHaveBeenCalledWith(1);
  });
});
