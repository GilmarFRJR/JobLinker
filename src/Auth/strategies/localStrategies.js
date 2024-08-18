import { Strategy as LocalStrategy } from "passport-local";

import { loginBuilder } from "../../services/loginBuilder.js";

export const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    const userToken = await loginBuilder.checkUserAndCreateToken(
      email,
      password
    );

    if (userToken) {
      return done(null, userToken);
    } else {
      return done(null, false);
    }
  }
);
