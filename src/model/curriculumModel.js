import db from "../libs/prisma.js";

export const manipulatingCurriculum = {
  upsert: async (userId, data) => {
    return await db.Curriculum.upsert({
      where: { userId },
      update: {
        description: data.description,
        details: data.details,
      },
      create: {
        userId,
        description: data.description,
        details: data.details,
      },
    });
  },
};
