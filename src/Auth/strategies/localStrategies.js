import { Strategy as LocalStrategy } from "passport-local";

import { loginBuilder } from "../../services/loginBuilder.js";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "identifier",
    passwordField: "password",
  },
  async (identifier, password, done) => {
    const isEmail = identifier.includes("@");
    const accountType = isEmail ? "user" : "company";

    const token = await loginBuilder.checkAccountAndCreateToken(
      identifier,
      password,
      accountType
    );

    if (token) {
      return done(null, token);
    } else {
      return done(null, false);
    }
  }
);
