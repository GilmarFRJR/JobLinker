import { ZodError } from "zod";

import { manipulatingJob } from "../model/jobModel.js";
import { createJobSchema, editJobSchema } from "../schemas/jobSchema.js";
import { jobController } from "./jobController.js";

const req = {
  body: {
    job: "Trabalhe aqui",
  },
  params: {
    id: 1,
  },
  company: {
    id: 1,
  },
  query: {
    page: 1,
    filter: null,
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

jest.mock("../model/jobModel.js");
jest.mock("../schemas/jobSchema.js");
jest.mock("../schemas/userSchemas.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getJob: async (req, res) => {...}", () => {
  test("searching for a job with a valid id", async () => {
    manipulatingJob.getOne.mockResolvedValue({ job: "Job legal" });

    await jobController.getJob(req, res);

    expect(manipulatingJob.getOne).toHaveBeenCalledWith(
      req.params.id || req.company.id
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ job: "Job legal" });
  });

  test("searching for a job with an invalid id", async () => {
    manipulatingJob.getOne.mockResolvedValue(null);

    await jobController.getJob(req, res);

    expect(manipulatingJob.getOne).toHaveBeenCalledWith(
      req.params.id || req.company.id
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test("searching for a job but an unexpected error occurred", async () => {
    manipulatingJob.getOne.mockRejectedValue(new Error());

    await jobController.getJob(req, res);

    expect(manipulatingJob.getOne).toHaveBeenCalledWith(
      req.params.id || req.company.id
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("getJobs: async (req, res) => {...}", () => {
  test("searching for jobs", async () => {
    manipulatingJob.getAll.mockResolvedValue([
      { job: "Job legal 1" },
      { job: "JOb legal 2" },
    ]);

    await jobController.getJobs(req, res);

    expect(manipulatingJob.getAll).toHaveBeenCalledWith(
      req.query.page,
      req.query.filter
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ jobs: undefined })
    );
  });

  test("searching for jobs  but an unexpected error occurred", async () => {
    manipulatingJob.getAll.mockRejectedValue(new Error());

    await jobController.getJobs(req, res);

    expect(manipulatingJob.getAll).toHaveBeenCalledWith(
      req.query.page,
      req.query.filter
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("getJobsCompany: async (req, res) => {...}", () => {
  test("searching for jobs at a company", async () => {
    manipulatingJob.getJobsCompany.mockResolvedValue([
      { job: "Job 1" },
      { job: "Job 2" },
    ]);

    await jobController.getJobsCompany(req, res);

    expect(manipulatingJob.getJobsCompany).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([{ job: "Job 1" }, { job: "Job 2" }]);
  });

  test("searching for jobs at a company but she has no jobs", async () => {
    manipulatingJob.getJobsCompany.mockResolvedValue([]);

    await jobController.getJobsCompany(req, res);

    expect(manipulatingJob.getJobsCompany).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ aviso: expect.any(String) })
    );
  });

  test("searching for jobs at a company but an unexpected error occurs", async () => {
    manipulatingJob.getJobsCompany.mockRejectedValue(new Error());

    await jobController.getJobsCompany(req, res);

    expect(manipulatingJob.getJobsCompany).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("createJob: async (req, res) => {...}", () => {
  test("creating a job with valid data", async () => {
    createJobSchema.parse.mockImplementation((data) => data);
    manipulatingJob.create.mockResolvedValue({ job: "Job legal" });

    await jobController.createJob(req, res);

    expect(manipulatingJob.create).toHaveBeenCalledWith(req.company.id, {
      job: "Trabalhe aqui",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ job: "Job legal" });
  });

  test("creating a job with invalid data", async () => {
    const zodError = new ZodError([
      {
        message: "Nome é obrigatório",
      },
    ]);

    createJobSchema.parse.mockImplementation(() => {
      throw zodError;
    });

    await jobController.createJob(req, res);

    expect(manipulatingJob.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Erro: expect.any(String),
        Detalhes: expect.any(Object),
      })
    );
  });

  test("creating a job but an unexpected error occurs", async () => {
    createJobSchema.parse.mockImplementation((data) => data);
    manipulatingJob.create.mockRejectedValue(new Error());

    await jobController.createJob(req, res);

    expect(manipulatingJob.create).toHaveBeenCalledWith(req.company.id, {
      job: "Trabalhe aqui",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("editJob: async (req, res) => {...}", () => {
  test("editing a job with valid data", async () => {
    editJobSchema.parse.mockImplementation((data) => data);
    manipulatingJob.edit.mockResolvedValue({ job: "Job legal" });

    await jobController.editJob(req, res);

    expect(manipulatingJob.edit).toHaveBeenCalledWith(
      req.company.id,
      req.params.id,
      {
        job: "Trabalhe aqui",
      }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ job: "Job legal" });
  });

  test("editing a job with invalid data", async () => {
    const zodError = new ZodError([
      {
        message: "Nome é obrigatório",
      },
    ]);

    editJobSchema.parse.mockImplementation(() => {
      throw zodError;
    });

    await jobController.editJob(req, res);

    expect(manipulatingJob.edit).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Erro: expect.any(String),
        Detalhes: expect.any(Object),
      })
    );
  });

  test("editing a job but an unexpected error occurs", async () => {
    editJobSchema.parse.mockImplementation((data) => data);
    manipulatingJob.edit.mockRejectedValue(new Error());

    await jobController.editJob(req, res);

    expect(manipulatingJob.edit).toHaveBeenCalledWith(
      req.company.id,
      req.params.id,
      {
        job: "Trabalhe aqui",
      }
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("deleteJob: async (req, res) => {...}", () => {
  test("deleting a job that exists", async () => {
    manipulatingJob.delete.mockResolvedValue({ job: "Job legal" });

    await jobController.deleteJob(req, res);

    expect(manipulatingJob.delete).toHaveBeenCalledWith(
      req.company.id,
      req.params.id
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ job: "Job legal" });
  });

  test("deleting a job that does not exist", async () => {
    const prismaError = new Error("Usuário não encontrado.");
    prismaError.code = "P2025";
    manipulatingJob.delete.mockRejectedValue(prismaError);

    await jobController.deleteJob(req, res);

    expect(manipulatingJob.delete).toHaveBeenCalledWith(
      req.company.id,
      req.params.id
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test("deleting a job but an unexpected error occurs", async () => {
    manipulatingJob.delete.mockRejectedValue(new Error());

    await jobController.deleteJob(req, res);

    expect(manipulatingJob.delete).toHaveBeenCalledWith(
      req.company.id,
      req.params.id
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("getApplication: async (req, res) => {...}", () => {
  test("getting applications from an existing user", async () => {
    manipulatingJob.applicationsJobs.mockResolvedValue([
      { user: "João" },
      { user: "Felsp" },
    ]);

    await jobController.getApplication(req, res);

    expect(manipulatingJob.applicationsJobs).toHaveBeenCalledWith(
      req.company.id,
      req.params.id
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { user: "João" },
      { user: "Felsp" },
    ]);
  });

  test("getting applications from a user but an unexpected error occurs", async () => {
    manipulatingJob.applicationsJobs.mockRejectedValue(new Error());

    await jobController.getApplication(req, res);

    expect(manipulatingJob.applicationsJobs).toHaveBeenCalledWith(
      req.company.id,
      req.params.id
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});
