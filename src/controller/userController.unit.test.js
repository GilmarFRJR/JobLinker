import bcrypt from "bcrypt";
import { ZodError } from "zod";

import { userController } from "./userController.js";
import { manipulatingUser } from "../model/userModel.js";
import { resize } from "../imageProcessing/multer.js";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas.js";
import { createCurriculumSchema } from "../schemas/curriculumSchema.js";
import { application } from "express";

const jsonTxt = {
  userData: {
    name: "Felps",
    email: "zzz@example.com",
    password: "SenhaSegura123",
    age: 29,
    profilePhotoReference: "",
    description:
      "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
    fieldOfWork: "Desenvolvimento de Software",
    technologies: {
      JavaScript: true,
      Python: true,
      Java: false,
      CSharp: false,
      React: true,
      NodeJs: true,
      Ruby: false,
      PHP: false,
    },
  },
};

const req = {
  body: {
    jsonTxt: JSON.stringify(jsonTxt),
  },
  params: {
    id: 1,
  },
  user: {
    id: 1,
  },
  file: "img",
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

jest.mock("../model/userModel.js");
jest.mock("../schemas/userSchemas.js");
jest.mock("../schemas/curriculumSchema.js");

jest.mock("bcrypt", () => ({
  genSalt: jest.fn().mockResolvedValue("mockedsalt"),
  hash: jest.fn().mockResolvedValue("mockedHash"),
}));
jest.mock("../imageProcessing/multer.js", () => ({
  resize: jest.fn().mockResolvedValue("ok"),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getUser: async (req, res) => {...}", () => {
  test("searching for a user with a valid id", async () => {
    manipulatingUser.getOne.mockResolvedValue({ user: "Felps" });

    await userController.getUser(req, res);

    expect(manipulatingUser.getOne).toHaveBeenCalledWith(
      req.params.id || req.user.id
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: "Felps" });
  });

  test("searching for a user with an invalid id", async () => {
    manipulatingUser.getOne.mockResolvedValue(null);

    await userController.getUser(req, res);

    expect(manipulatingUser.getOne).toHaveBeenCalledWith(
      req.params.id || req.user.id
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test("searching for a user but an unexpected error occurred", async () => {
    manipulatingUser.getOne.mockRejectedValue(new Error());

    await userController.getUser(req, res);

    expect(manipulatingUser.getOne).toHaveBeenCalledWith(
      req.params.id || req.user.id
    );

    expect(manipulatingUser.getOne).toHaveBeenCalledWith(
      req.params.id || req.user.id
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("getUsers: async (req, res) => {...}", () => {
  test("searching for users", async () => {
    manipulatingUser.getAll.mockResolvedValue([
      { user: "Felps" },
      { user: "Ricardo" },
    ]);

    await userController.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.arrayContaining([{ user: "Felps" }, { user: "Ricardo" }])
    );
  });

  test("searching for users  but an unexpected error occurred", async () => {
    manipulatingUser.getAll.mockRejectedValue(new Error());

    await userController.getUsers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe(" createUser: async (req, res) => {..}", () => {
  test("creating a user with valid data", async () => {
    createUserSchema.parse.mockImplementation((data) => data);
    manipulatingUser.create.mockResolvedValue({ user: "Felps" });

    await userController.createUser(req, res);

    expect(manipulatingUser.create).toHaveBeenCalledWith(
      {
        name: "Felps",
        email: "zzz@example.com",
        password: "mockedHash",
        age: 29,
        profilePhotoReference: undefined,
        description:
          "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
        fieldOfWork: "Desenvolvimento de Software",
        technologies: {
          JavaScript: true,
          Python: true,
          Java: false,
          CSharp: false,
          React: true,
          NodeJs: true,
          Ruby: false,
          PHP: false,
        },
      },
      undefined
    );
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("SenhaSegura123", "mockedsalt");
    expect(resize).toHaveBeenCalledWith("img");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user: "Felps" });
  });

  test("creating a user with invalid data", async () => {
    const zodError = new ZodError([
      {
        message: "Nome é obrigatório",
      },
    ]);

    createUserSchema.parse.mockImplementation(() => {
      throw zodError;
    });

    await userController.createUser(req, res);

    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(manipulatingUser.create).not.toHaveBeenCalled();
    expect(resize).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Erro: expect.any(String),
        Detalhes: expect.any(Object),
      })
    );
  });

  test("creating a user with an existing email", async () => {
    createUserSchema.parse.mockImplementation((data) => data);
    manipulatingUser.create.mockResolvedValue(null);

    await userController.createUser(req, res);

    expect(manipulatingUser.create).toHaveBeenCalledWith(
      {
        name: "Felps",
        email: "zzz@example.com",
        password: "mockedHash",
        age: 29,
        profilePhotoReference: undefined,
        description:
          "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
        fieldOfWork: "Desenvolvimento de Software",
        technologies: {
          JavaScript: true,
          Python: true,
          Java: false,
          CSharp: false,
          React: true,
          NodeJs: true,
          Ruby: false,
          PHP: false,
        },
      },
      undefined
    );
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: expect.any(String),
      })
    );
  });

  test("creating a user but an unexpected error occurs", async () => {
    createUserSchema.parse.mockImplementation((data) => data);
    manipulatingUser.create.mockRejectedValue(new Error());

    await userController.createUser(req, res);

    expect(manipulatingUser.create).toHaveBeenCalledWith(
      {
        name: "Felps",
        email: "zzz@example.com",
        password: "mockedHash",
        age: 29,
        profilePhotoReference: undefined,
        description:
          "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
        fieldOfWork: "Desenvolvimento de Software",
        technologies: {
          JavaScript: true,
          Python: true,
          Java: false,
          CSharp: false,
          React: true,
          NodeJs: true,
          Ruby: false,
          PHP: false,
        },
      },
      undefined
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("editUser: async (req, res) => {...}", () => {
  test("editing a user with valid data", async () => {
    updateUserSchema.parse.mockImplementation((data) => data);
    manipulatingUser.edit.mockResolvedValue({ user: "Felps Jr." });

    await userController.editUser(req, res);

    expect(manipulatingUser.edit).toHaveBeenCalledWith(req.user.id, {
      name: "Felps",
      email: "zzz@example.com",
      password: "mockedHash",
      age: 29,
      profilePhotoReference: undefined,
      description:
        "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
      fieldOfWork: "Desenvolvimento de Software",
      technologies: {
        JavaScript: true,
        Python: true,
        Java: false,
        CSharp: false,
        React: true,
        NodeJs: true,
        Ruby: false,
        PHP: false,
      },
    });
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith("SenhaSegura123", "mockedsalt");
    expect(resize).toHaveBeenCalledWith("img");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user: "Felps Jr." });
  });

  test("editing a user with invalid data", async () => {
    const zodError = new ZodError([
      {
        message: "Nome é obrigatório",
      },
    ]);

    updateUserSchema.parse.mockImplementation(() => {
      throw zodError;
    });

    await userController.editUser(req, res);

    expect(bcrypt.genSalt).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(manipulatingUser.edit).not.toHaveBeenCalled();
    expect(resize).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        Erro: expect.any(String),
        Detalhes: expect.any(Object),
      })
    );
  });

  test("editing a user with an existing email", async () => {
    updateUserSchema.parse.mockImplementation((data) => data);
    manipulatingUser.edit.mockResolvedValue(null);

    await userController.editUser(req, res);

    expect(manipulatingUser.edit).toHaveBeenCalledWith(req.user.id, {
      name: "Felps",
      email: "zzz@example.com",
      password: "mockedHash",
      age: 29,
      profilePhotoReference: undefined,
      description:
        "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
      fieldOfWork: "Desenvolvimento de Software",
      technologies: {
        JavaScript: true,
        Python: true,
        Java: false,
        CSharp: false,
        React: true,
        NodeJs: true,
        Ruby: false,
        PHP: false,
      },
    });
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        erro: expect.any(String),
      })
    );
  });

  test("editing a user but an unexpected error occurs", async () => {
    updateUserSchema.parse.mockImplementation((data) => data);
    manipulatingUser.edit.mockRejectedValue(new Error());

    await userController.editUser(req, res);

    expect(manipulatingUser.edit).toHaveBeenCalledWith(req.user.id, {
      name: "Felps",
      email: "zzz@example.com",
      password: "mockedHash",
      age: 29,
      profilePhotoReference: undefined,
      description:
        "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
      fieldOfWork: "Desenvolvimento de Software",
      technologies: {
        JavaScript: true,
        Python: true,
        Java: false,
        CSharp: false,
        React: true,
        NodeJs: true,
        Ruby: false,
        PHP: false,
      },
    });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("deleteUser: async (req, res) => {...}", () => {
  test("deleting a user that exists", async () => {
    manipulatingUser.delete.mockResolvedValue({ user: "Felps" });

    await userController.deleteUser(req, res);

    expect(manipulatingUser.delete).toHaveBeenCalledWith(
      req.params.id || req.user.id
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: "Felps" });
  });

  test("deleting a user that does not exist", async () => {
    const prismaError = new Error("Usuário não encontrado.");
    prismaError.code = "P2025";
    manipulatingUser.delete.mockRejectedValue(prismaError);

    await userController.deleteUser(req, res);

    expect(manipulatingUser.delete).toHaveBeenCalledWith(
      req.params.id || req.user.id
    );
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test("deleting a user but an unexpected error occurs", async () => {
    manipulatingUser.delete.mockRejectedValue(new Error());

    await userController.deleteUser(req, res);

    expect(manipulatingUser.delete).toHaveBeenCalledWith(
      req.params.id || req.user.id
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});

describe("getApplication: async (req, res) => {..}", () => {
  test("getting applications from an existing user", async () => {
    manipulatingUser.applicationsUser.mockResolvedValue({
      applications: "Company LTDA",
    });

    await userController.getApplication(req, res);

    expect(manipulatingUser.applicationsUser).toHaveBeenCalledWith(
      req.params.id || req.user.id
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ applications: "Company LTDA" });
  });

  test("getting applications from a user that doesn't exist", async () => {
    manipulatingUser.applicationsUser.mockResolvedValue(null);

    await userController.getApplication(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test("getting applications from a user but an unexpected error occurs", async () => {
    manipulatingUser.applicationsUser.mockRejectedValue(new Error());

    await userController.getApplication(req, res);

    expect(manipulatingUser.applicationsUser).toHaveBeenCalledWith(
      req.params.id || req.user.id
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});
