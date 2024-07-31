import db from "../libs/prisma.js";

export const manipulatinApplication = {
  apply: async (userId, jobId) => {
    const user = await db.JobApplication.findUnique({
      where: { userId_jobId: { userId, jobId } },
    });

    if (user) return undefined;

    return await db.JobApplication.create({
      data: {
        userId,
        jobId,
      },
    });
  },
};
