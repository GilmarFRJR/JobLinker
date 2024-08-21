import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import dotenv from "dotenv";
import { loginBuilder } from "../../services/loginBuilder.js";

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

export const jwtStrategy = new JWTStrategy(options, async (payload, done) => {
  const accountType = payload.isCompany ? "company" : "user";

  const account = await loginBuilder.checkAccount(payload.id, accountType);

  if (account) {
    return done(null, payload);
  } else {
    return done(null, false);
  }
});
