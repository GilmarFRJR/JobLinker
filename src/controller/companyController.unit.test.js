import bcrypt from "bcrypt";
import { ZodError } from "zod";

import { manipulatingCompany } from "../model/companyModel.js";
import {
  createCompanySchema,
  updateCompanySchema,
} from "../schemas/companySchema.js";
import { companyController } from "./companyController.js";

const req = {
  body: {
    name: "Empresa LTDA",
    description:
      "Empresa especializada em desenvolvimento de software muito avançados e legais ebaaaaaaaaaaaaaaaaaaaaaaaaa.",
    CNPJ: "20.332.678/0001-99",
    password: "SenhaSegura123",
    foundation: "2001-06-15",
  },
  params: {
    id: 1,
  },
  query: {
    name: "Empresa LTDA",
  },
  company: {
    id: 1,
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

jest.mock("../model/companyModel.js");
jest.mock("../schemas/companySchema.js");

jest.mock("bcrypt", () => ({
  genSalt: jest.fn().mockResolvedValue("mockedsalt"),
  hash: jest.fn().mockResolvedValue("mockedHash"),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getCompany: async (req, res) => {...}", () => {
  test("taking a company that exists", async () => {
    manipulatingCompany.getOne.mockResolvedValue({ company: "Empresa LTDA" });

    await companyController.getCompany(req, res);

    expect(manipulatingCompany.getOne).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ company: "Empresa LTDA" });
  });

  test("taking a company that doesn't exist", async () => {
    manipulatingCompany.getOne.mockResolvedValue(null);

    await companyController.getCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test("taking a company but an unexpected error occurred", async () => {
    manipulatingCompany.getOne.mockRejectedValue(new Error());

    await companyController.getCompany(req, res);

    expect(manipulatingCompany.getOne).toHaveBeenCalledWith(req.params.id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("getAllCompany: async (req, res) => {...}", () => {
  test("taking all the companies that exist", async () => {
    manipulatingCompany.getAll.mockResolvedValue([
      { company: "Empresa LTDA" },
      { company: "Empresa LTDA 2" },
    ]);

    await companyController.getAllCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith([
      { company: "Empresa LTDA" },
      { company: "Empresa LTDA 2" },
    ]);
  });

  test("taking all the companies that exist but an unexpected error occurs", async () => {
    manipulatingCompany.getAll.mockRejectedValue(new Error());

    await companyController.getAllCompany(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("searchCompany: async (req, res) => {...}", () => {
  test("searching for a company by name, and it exists", async () => {
    manipulatingCompany.search.mockResolvedValue({ company: "Empresa LTDA" });

    await companyController.searchCompany(req, res);

    expect(manipulatingCompany.search).toHaveBeenCalledWith(req.query.name);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ company: "Empresa LTDA" });
  });

  test("searching for a company by name, and it doesn't exist", async () => {
    manipulatingCompany.search.mockResolvedValue(null);

    await companyController.searchCompany(req, res);

    expect(manipulatingCompany.search).toHaveBeenCalledWith(req.query.name);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test("searching for a company by name but an unexpected error occurs", async () => {
    manipulatingCompany.search.mockRejectedValue(new Error());

    await companyController.searchCompany(req, res);

    expect(manipulatingCompany.search).toHaveBeenCalledWith(req.query.name);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("createCompany: async (req, res) => {...}", () => {
  test("creating a company with valid data", async () => {
    createCompanySchema.parse.mockImplementation((data) => data);
    manipulatingCompany.create.mockResolvedValue({ company: "Empresa LTDA" });

    await companyController.createCompany(req, res);

    expect(manipulatingCompany.create).toHaveBeenCalledWith({
      name: "Empresa LTDA",
      description:
        "Empresa especializada em desenvolvimento de software muito avançados e legais ebaaaaaaaaaaaaaaaaaaaaaaaaa.",
      CNPJ: "20.332.678/0001-99",
      password: "mockedHash",
      foundation: "2001-06-15",
    });
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("SenhaSegura123", "mockedsalt");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ company: "Empresa LTDA" });
  });

  test("creating a company with invalid data", async () => {
    const zodError = new ZodError([
      {
        message: "Nome é obrigatório",
      },
    ]);
    createCompanySchema.parse.mockImplementation(() => {
      throw zodError;
    });

    await companyController.createCompany(req, res);

    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(manipulatingCompany.create).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Erro: expect.any(String),
        Detalhes: expect.any(Object),
      })
    );
  });

  test("creating a company but the CNPJ already exists", async () => {
    createCompanySchema.parse.mockImplementation((data) => data);
    manipulatingCompany.create.mockResolvedValue(null);

    await companyController.createCompany(req, res);

    expect(manipulatingCompany.create).toHaveBeenCalledWith({
      name: "Empresa LTDA",
      description:
        "Empresa especializada em desenvolvimento de software muito avançados e legais ebaaaaaaaaaaaaaaaaaaaaaaaaa.",
      CNPJ: "20.332.678/0001-99",
      password: "mockedHash",
      foundation: "2001-06-15",
    });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: expect.any(String),
      })
    );
  });

  test("creating a company but an unexpected error occurs", async () => {
    createCompanySchema.parse.mockImplementation((data) => data);
    manipulatingCompany.create.mockRejectedValue(new Error());

    await companyController.createCompany(req, res);

    expect(manipulatingCompany.create).toHaveBeenCalledWith({
      name: "Empresa LTDA",
      description:
        "Empresa especializada em desenvolvimento de software muito avançados e legais ebaaaaaaaaaaaaaaaaaaaaaaaaa.",
      CNPJ: "20.332.678/0001-99",
      password: "mockedHash",
      foundation: "2001-06-15",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });
});

describe("editCompany: async (req, res) => {...}", () => {
  test("editing a company with valid data", async () => {
    updateCompanySchema.parse.mockImplementation((data) => {
      return { ...data, password: "SenhaSegura123" };
    });
    manipulatingCompany.edit.mockResolvedValue({ company: "Empresa LTDA" });

    await companyController.editCompany(req, res);

    expect(manipulatingCompany.edit).toHaveBeenCalledWith(req.company.id, {
      name: "Empresa LTDA",
      description:
        "Empresa especializada em desenvolvimento de software muito avançados e legais ebaaaaaaaaaaaaaaaaaaaaaaaaa.",
      CNPJ: "20.332.678/0001-99",
      password: "mockedHash",
      foundation: "2001-06-15",
    });
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("SenhaSegura123", "mockedsalt");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ company: "Empresa LTDA" });
  });

  test("editing a company with invalid data", async () => {
    const zodError = new ZodError([
      {
        message: "Nome é obrigatório",
      },
    ]);
    updateCompanySchema.parse.mockImplementation(() => {
      throw zodError;
    });

    await companyController.editCompany(req, res);

    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(manipulatingCompany.edit).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Erro: expect.any(String),
        Detalhes: expect.any(Object),
      })
    );
  });

  test("editing a company but the CNPJ already exists", async () => {
    updateCompanySchema.parse.mockImplementation((data) => data);
    manipulatingCompany.edit.mockResolvedValue(null);

    await companyController.editCompany(req, res);

    expect(manipulatingCompany.edit).toHaveBeenCalledWith(req.company.id, {
      name: "Empresa LTDA",
      description:
        "Empresa especializada em desenvolvimento de software muito avançados e legais ebaaaaaaaaaaaaaaaaaaaaaaaaa.",
      CNPJ: "20.332.678/0001-99",
      password: "mockedHash",
      foundation: "2001-06-15",
    });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: expect.any(String),
      })
    );
  });

  test("editing a company but an unexpected error occurs", async () => {
    updateCompanySchema.parse.mockImplementation((data) => data);
    manipulatingCompany.edit.mockRejectedValue(new Error());

    await companyController.editCompany(req, res);

    expect(manipulatingCompany.edit).toHaveBeenCalledWith(req.company.id, {
      name: "Empresa LTDA",
      description:
        "Empresa especializada em desenvolvimento de software muito avançados e legais ebaaaaaaaaaaaaaaaaaaaaaaaaa.",
      CNPJ: "20.332.678/0001-99",
      password: "mockedHash",
      foundation: "2001-06-15",
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });
});

describe("deleteCompany: async (req, res) => {...}", () => {
  test("deleting a company that exists", async () => {
    manipulatingCompany.delete.mockResolvedValue({ company: "Empresa LTDA" });

    await companyController.deleteCompany(req, res);

    expect(manipulatingCompany.delete).toHaveBeenCalledWith(req.company.id);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ company: "Empresa LTDA" });
  });

  test("deleting a company that does not exist", async () => {
    const prismaError = new Error("Usuário não encontrado.");
    prismaError.code = "P2025";
    manipulatingCompany.delete.mockRejectedValue(prismaError);

    await companyController.deleteCompany(req, res);

    expect(manipulatingCompany.delete).toHaveBeenCalledWith(req.company.id);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test("deleting a company but an unexpected error occurs", async () => {
    manipulatingCompany.delete.mockRejectedValue(new Error());

    await companyController.deleteCompany(req, res);

    expect(manipulatingCompany.delete).toHaveBeenCalledWith(req.company.id);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});
