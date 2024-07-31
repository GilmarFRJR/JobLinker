import db from "../libs/prisma.js";

export const manipulatingUser = {
  getOne: async (id) => {
    return await db.UserProfile.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        email: true,
        description: true,
        fieldOfWork: true,
        technologies: true,
        curriculum: true,
      },
    });
  },
  getAll: async () => {
    return await db.UserProfile.findMany({
      select: {
        name: true,
        email: true,
        description: true,
        fieldOfWork: true,
        technologies: true,
      },
    });
  },

  create: async (userData, curriculumData) => {
    return await db.UserProfile.create({
      data: {
        name: userData.name,
        email: userData.email,
        age: userData.age,
        description: userData.description,
        fieldOfWork: userData.fieldOfWork,
        technologies: userData.technologies,
        curriculum: curriculumData
          ? {
              create: {
                description: curriculumData.description,
                details: curriculumData.details,
              },
            }
          : undefined,
      },
      include: {
        curriculum: true,
      },
    });
  },

  edit: async (id, data) => {
    return await db.UserProfile.update({
      where: {
        id,
      },

      data: {
        name: data.name,
        email: data.email,
        age: data.age,
        description: data.description,
        fieldOfWork: data.fieldOfWork,
        technologies: data.technologies,
      },
    });
  },

  delete: async (id) => {
    return await db.UserProfile.delete({
      where: {
        id,
      },
    });
  },

  applicationsUser: async (userId) => {
    return await db.UserProfile.findUnique({
      where: { id: userId },
      select: {
        _count: {
          select: {
            applications: true,
          },
        },
        applications: {
          select: {
            job: {
              select: {
                companyName: true,
                description: true,
                details: true,
                jobType: true,
              },
            },
          },
        },
      },
    });
  },
};
