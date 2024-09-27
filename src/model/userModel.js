import db from "../libs/prisma.js";

export const manipulatingUser = {
  getOne: async (id) => {
    return await db.UserProfile.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
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
        id: true,
        name: true,
        email: true,
        description: true,
        fieldOfWork: true,
        technologies: true,
      },
    });
  },

  create: async (userData, curriculumData) => {
    const user = await db.UserProfile.findUnique({
      where: {
        email: userData.email,
      },
    });

    if (user) return false;

    return await db.UserProfile.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        age: userData.age,
        profilePhotoReference: userData.profilePhotoReference,
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
    let user = null;

    if (data.email) {
      user = await db.UserProfile.findUnique({
        where: {
          email: data.email,
        },
      });
    }

    if (user) return false;

    return await db.UserProfile.update({
      where: {
        id,
      },

      data: {
        name: data.name,
        email: data.email,
        age: data.age,
        profilePhotoReference: data.profilePhotoReference,
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
