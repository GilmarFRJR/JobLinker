import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

import { loginDBconsult } from "./loginDBconsult.js";
import dotenv from "dotenv";

dotenv.config();

export const loginBuilder = {
  checkUserAndCreateToken: async (email, password) => {
    try {
      const user = await loginDBconsult.getUserByEmail(email);

      if (!user) return false;

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) return false;

      const token = JWT.sign({ id: user.id }, process.env.SECRET_KEY);

      return token;
    } catch (err) {
      return err;
    }
  },

  checkUser: async (id) => {
    try {
      const user = await loginDBconsult.getUserById(id);

      if (user) return user;

      return false;
    } catch (err) {
      return err;
    }
  },
};
