import db from "../libs/prisma.js";

const pageSize = 3;

export const manipulatingJob = {
  getOne: async (id) => {
    return await db.JobOpportunity.findUnique({
      where: {
        id,
      },
      select: {
        companyName: true,
        description: true,
        details: true,
        jobType: true,
      },
    });
  },

  getAll: async (page, filter) => {
    const whereClause = filter ? { jobType: filter } : {};

    const totalJobs = await db.JobOpportunity.count({
      where: whereClause,
    });

    const jobs = await db.JobOpportunity.findMany({
      where: whereClause,

      skip: (page - 1) * pageSize,
      take: pageSize,

      select: {
        companyName: true,
        description: true,
        details: true,
        jobType: true,
      },
    });

    const totalPages = Math.ceil(totalJobs / pageSize);

    return {
      jobs,
      totalJobs,
      totalPages,
      currentPage: page,
    };
  },

  getJobsCompany: async (companyId) => {
    return await db.JobOpportunity.findMany({
      where: { companyId },

      select: {
        companyName: true,
        description: true,
        details: true,
        jobType: true,
      },
    });
  },

  create: async (companyId, data) => {
    const companyName = await db.CompanyProfile.findUnique({
      where: { id: companyId },
      select: {
        name: true,
      },
    });

    return await db.JobOpportunity.create({
      data: {
        companyId,
        companyName: companyName.name,
        description: data.description,
        details: data.details,
        jobType: data.jobType,
      },
    });
  },

  edit: async (id, data) => {
    return await db.JobOpportunity.update({
      where: {
        id,
      },
      data: {
        description: data.description,
        details: data.details,
        jobType: data.jobType,
      },
    });
  },

  delete: async (id) => {
    return await db.JobOpportunity.delete({
      where: {
        id,
      },
    });
  },

  applicationsJobs: async (jobId) => {
    return await db.JobOpportunity.findUnique({
      where: { id: jobId },
      select: {
        companyName: true,
        description: true,
        details: true,
        jobType: true,
        _count: {
          select: {
            applications: true,
          },
        },
        applications: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                age: true,
                description: true,
                fieldOfWork: true,
                technologies: true,
                curriculum: true,
              },
            },
          },
        },
      },
    });
  },
};
