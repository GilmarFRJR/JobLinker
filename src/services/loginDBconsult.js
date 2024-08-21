import db from "../libs/prisma.js";

export const loginDBconsult = {
  getUserByEmail: async (email) => {
    return await db.UserProfile.findUnique({
      where: {
        email,
      },
    });
  },
  getUserById: async (id) => {
    return await db.UserProfile.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
      },
    });
  },

  getCompanyByCNPJ: async (CNPJ) => {
    return await db.CompanyProfile.findUnique({
      where: {
        CNPJ,
      },
    });
  },
  getCompanyById: async (id) => {
    return await db.CompanyProfile.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        CNPJ: true,
      },
    });
  },
};
