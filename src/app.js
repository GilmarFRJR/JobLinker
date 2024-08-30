import expess from "express";
import passport from "passport";
import dotenv from "dotenv";

import routers from "./routers/index.js";

import { localStrategy } from "./Auth/strategies/localStrategies.js";
import { jwtStrategy } from "./Auth/strategies/JWTstrategies.js";

const app = expess();

app.use(expess.json());
app.use(expess.urlencoded({ extended: true }));

passport.use(localStrategy);
passport.use(jwtStrategy);
app.use(passport.initialize());

dotenv.config();

app.use(routers);

export default app;
