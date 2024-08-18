import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import dotenv from "dotenv";
import { loginBuilder } from "../../services/loginBuilder.js";

dotenv.config();

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET_KEY,
};

export const jwtStrategy = new JWTStrategy(options, async (payload, done) => {
  const user = await loginBuilder.checkUser(payload.id);

  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
});
