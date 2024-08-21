import JWT from "jsonwebtoken";
import bcrypt from "bcrypt";

import { loginDBconsult } from "./loginDBconsult.js";
import dotenv from "dotenv";

dotenv.config();

export const loginBuilder = {
  checkAccountAndCreateToken: async (identifier, password, accountType) => {
    try {
      let account;
      let token;

      if (accountType === "user") {
        account = await loginDBconsult.getUserByEmail(identifier);
      } else {
        account = await loginDBconsult.getCompanyByCNPJ(identifier);
      }

      if (!account) return false;

      const isMatch = await bcrypt.compare(password, account.password);
      if (!isMatch) return false;

      if (accountType === "user") {
        token = JWT.sign(
          { isCompany: false, id: account.id },
          process.env.SECRET_KEY
        );
      } else {
        token = JWT.sign(
          { isCompany: true, id: account.id },
          process.env.SECRET_KEY
        );
      }

      return token;
    } catch (err) {
      return err;
    }
  },

  checkAccount: async (id, accountType) => {
    try {
      let account;

      if (accountType === "user") {
        account = await loginDBconsult.getUserById(id);
      } else {
        account = await loginDBconsult.getCompanyById(id);
      }

      return account || false;
    } catch (err) {
      return err;
    }
  },
};
