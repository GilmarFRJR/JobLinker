import db from "../libs/prisma.js";

export const manipulatingCompany = {
  getOne: async (id) => {
    return await db.CompanyProfile.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        description: true,
        foundation: true,
        hiring: true,
        jobOpportunities: true,
        _count: {
          select: {
            jobOpportunities: true,
          },
        },
      },
    });
  },
  getAll: async () => {
    return await db.CompanyProfile.findMany({
      select: {
        name: true,
        description: true,
        foundation: true,
        hiring: true,
        _count: {
          select: {
            jobOpportunities: true,
          },
        },
      },
    });
  },

  search: async (data) => {
    const dataLowerCase = data.toLowerCase();
    return await db.CompanyProfile.findMany({
      where: {
        name: {
          contains: dataLowerCase,
        },
      },
      select: {
        name: true,
        description: true,
        foundation: true,
        hiring: true,
        _count: {
          select: {
            jobOpportunities: true,
          },
        },
      },
    });
  },

  create: async (data) => {
    const company = await db.CompanyProfile.findFirst({
      where: {
        OR: [{ name: data.name }, { CNPJ: data.CNPJ }],
      },
    });

    if (company) return false;

    return await db.CompanyProfile.create({
      data: {
        name: data.name,
        description: data.description,
        CNPJ: data.CNPJ,
        password: data.password,
        foundation: data.foundation,
        hiring: data.hiring,
      },
    });
  },

  edit: async (id, data) => {
    const company = await db.CompanyProfile.findFirst({
      where: {
        OR: [{ name: data.name }, { CNPJ: data.CNPJ }],
      },
    });

    if (company) return false;

    return await db.CompanyProfile.update({
      where: {
        id,
      },

      data: {
        name: data.name,
        description: data.description,
        CNPJ: data.CNPJ,
        password: data.password,
        foundation: data.foundation,
        hiring: data.hiring,
      },
    });
  },

  delete: async (id) => {
    return await db.CompanyProfile.delete({
      where: {
        id,
      },
    });
  },
};
