import request from "supertest";
import path from "path";
import fs from "fs";
import passport, { authenticate } from "passport";

import db from "../libs/prisma.js";
import app from "../app";

import { userController } from "../controller/userController.js";
import { manipulatingUser } from "../model/userModel.js";

import { jwtStrategyAuth } from "../Auth/middleware/authorization.js";

import { upload } from "../imageProcessing/multer.js";
import exp from "constants";

afterAll(() => {
  const dirPath = path.resolve(__dirname, "../../imgDB");

  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file) => {
      const filePath = path.join(dirPath, file);

      if (fs.lstatSync(filePath).isFile()) {
        fs.unlinkSync(filePath);
      }
    });
  }
});

afterEach(() => {
  jest.clearAllMocks();
});

beforeEach(() => {
  jest
    .spyOn(passport, "authenticate")
    .mockImplementation((strategy, callback) => {
      return (req, res, next) => {
        const account = { id: global.testUserId, isCompany: false };
        callback(null, account);
      };
    });
});

describe("router.get('/all', jwtStrategyAuth, userController.getUsers)", () => {
  test("catching all users", async () => {
    const response = await request(app).get("/user/all");

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(Number),
          name: expect.any(String),
          email: expect.any(String),
          description: expect.any(String),
          fieldOfWork: expect.any(String),
          technologies: expect.any(Object),
        }),
      ])
    );
  });

  test("catching all users but an unexpected error occurs", async () => {
    jest.spyOn(manipulatingUser, "getAll").mockRejectedValue(new Error());

    const response = await request(app).get("/user/all");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  test("catching all users but you are not logged in", async () => {
    jest
      .spyOn(passport, "authenticate")
      .mockImplementation((strategy, callback) => {
        return (req, res, next) => {
          const account = { id: 1, isCompany: false };
          callback(null, false);
        };
      });

    const response = await request(app).get("/user/all");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        mensagem: "Acesso negado. Talvez você não esteja logado.",
      })
    );
  });
});

describe("router.get('/:id', jwtStrategyAuth, userController.getUser);", () => {
  test("getting an existing user", async () => {
    const response = await request(app).get(`/user/${global.testUserId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: expect.any(String),
        email: expect.any(String),
        description: expect.any(String),
        fieldOfWork: expect.any(String),
        technologies: expect.any(Object),
      })
    );
  });

  test("getting an non-existing user", async () => {
    const response = await request(app).get("/user/1");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  test("catching a user but an unexpected error happens", async () => {
    jest.spyOn(manipulatingUser, "getOne").mockRejectedValue(new Error());

    const response = await request(app).get("/user/1");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  test("catching a user but you are not logged in", async () => {
    jest
      .spyOn(passport, "authenticate")
      .mockImplementation((strategy, callback) => {
        return (req, res, next) => {
          const account = { id: 1, isCompany: false };
          callback(null, false);
        };
      });

    const response = await request(app).get("/user/1");

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        mensagem: "Acesso negado. Talvez você não esteja logado.",
      })
    );
  });
});

describe("router.get('/jobs/:id', jwtStrategyAuth, userController.getApplication);", () => {
  test("catching applications from an existing user", async () => {
    const response = await request(app).get(`/user/jobs/${global.testUserId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        _count: expect.objectContaining({
          applications: expect.any(Number),
        }),
        applications: expect.arrayContaining([
          expect.objectContaining({
            job: expect.objectContaining({
              companyName: expect.any(String),
              description: expect.any(String),
              details: expect.any(String),
              jobType: expect.any(String),
            }),
          }),
        ]),
      })
    );
  });

  test("catching applications from a user who never applied", async () => {
    const response = await request(app).get(`/user/jobs/${global.testUser2Id}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toStrictEqual({ error: expect.any(String) });
  });

  test("catching applications from an user but an unexpected error happens", async () => {
    jest
      .spyOn(manipulatingUser, "applicationsUser")
      .mockRejectedValue(new Error());

    const response = await request(app).get(`/user/jobs/${global.testUser2Id}`);

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  test("catching applications from an user but you are not logged in", async () => {
    jest
      .spyOn(passport, "authenticate")
      .mockImplementation((strategy, callback) => {
        return (req, res, next) => {
          const account = { id: 1, isCompany: false };
          callback(null, false);
        };
      });

    const response = await request(app).get(`/user/jobs/${global.testUser2Id}`);

    expect(response.statusCode).toBe(401);
    expect(response.body).toEqual(
      expect.objectContaining({
        mensagem: "Acesso negado. Talvez você não esteja logado.",
      })
    );
  });
});

describe("router.post('/', upload.single('perfil'), userController.createUser);", () => {
  let newUser = {
    userData: {
      name: "João",
      email: "testeCreate@example.com",
      password: "senha12345",
      age: 29,
      profilePhotoReference: "",
      description:
        "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
      fieldOfWork: "Desenvolvimento de Software",
      technologies: {
        JavaScript: true,
        Python: true,
        Java: false,
        "C#": false,
        React: true,
        "Node.js": true,
        Ruby: false,
        PHP: false,
      },
    },
  };

  let newUserandCurriculum = {
    userData: {
      name: "João",
      email: "testeCreate@example.com",
      password: "senha12345",
      age: 29,
      profilePhotoReference: "",
      description:
        "Desenvolvedora Full Stack com paixão por criar soluções inovadoras.",
      fieldOfWork: "Desenvolvimento de Software",
      technologies: {
        JavaScript: true,
        Python: true,
        Java: false,
        "C#": false,
        React: true,
        "Node.js": true,
        Ruby: false,
        PHP: false,
      },
    },
    curriculumData: {
      description:
        "descrição teste aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      details:
        "detalhes teste aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    },
  };

  afterEach(() => {
    newUser.userData.email = "testeCreate@example.com";
  });

  test("creating a user without a curriculum", async () => {
    const response = await request(app)
      .post("/user/")
      .field("jsonTxt", JSON.stringify(newUser))
      .attach("perfil", path.resolve(__dirname, "../fixtures/uhu.PNG"));

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(
      expect.objectContaining({ email: newUser.userData.email })
    );

    const userDB = await db.userProfile.findUnique({
      where: { email: newUser.userData.email },
    });

    expect(userDB.email).toBe("testeCreate@example.com");
    expect(userDB.password).not.toBe(newUser.password);
    expect(userDB.profilePhotoReference).toBeDefined();
    expect(userDB.profilePhotoReference.startsWith("uhu")).toBe(true);

    const filePath = path.resolve(
      __dirname,
      "../../imgDB",
      userDB.profilePhotoReference
    );

    expect(fs.existsSync(filePath)).toBe(true);
  });

  test("creating a user with curriculum", async () => {
    const response = await request(app)
      .post("/user/")
      .field("jsonTxt", JSON.stringify(newUserandCurriculum));

    expect(response.statusCode).toBe(201);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        email: newUserandCurriculum.userData.email,
        curriculum: expect.objectContaining({
          description: newUserandCurriculum.curriculumData.description,
          details: newUserandCurriculum.curriculumData.details,
        }),
      })
    );

    const userDB = await db.userProfile.findUnique({
      where: { email: newUserandCurriculum.userData.email },
    });

    const curriculumUser = await db.Curriculum.findUnique({
      where: { userId: userDB.id },
    });

    expect(userDB.email).toBe("testeCreate@example.com");
    expect(userDB.password).not.toBe(newUser.password);
    expect;
    expect(curriculumUser.description).toEqual(
      newUserandCurriculum.curriculumData.description
    );
    expect(curriculumUser.details).toEqual(
      newUserandCurriculum.curriculumData.details
    );
  });

  test("creating a user with existing email", async () => {
    const response1 = await request(app)
      .post("/user/")
      .field("jsonTxt", JSON.stringify(newUser));

    const response2 = await request(app)
      .post("/user/")
      .field("jsonTxt", JSON.stringify(newUser));

    expect(response1.statusCode).toBe(201);
    expect(response1.body).toStrictEqual(
      expect.objectContaining({ email: newUser.userData.email })
    );

    expect(response2.statusCode).toBe(409);
    expect(response2.body).toStrictEqual(
      expect.objectContaining({ erro: "Email já em uso." })
    );
  });

  test("creating a user with invalid data", async () => {
    newUser.userData.email = 1234;

    const response = await request(app)
      .post("/user/")
      .field("jsonTxt", JSON.stringify(newUser));

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        Erro: "informações faltando ou em formato incorreto.",
        Detalhes: expect.any(Object),
      })
    );
  });

  test("creating a user but an unexpected error occurs", async () => {
    jest.spyOn(manipulatingUser, "create").mockRejectedValue(new Error());

    const response = await request(app)
      .post("/user/")
      .field("jsonTxt", JSON.stringify(newUser));

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });
});

describe("router.put('/', jwtStrategyAuth, upload.single('perfil'), userController.editUser);", () => {
  test("editing a user", async () => {
    const editedName = {
      userData: {
        name: "Novo Nome",
      },
    };

    const originalUser = await db.userProfile.findUnique({
      where: { id: global.testUserId },
    });

    const respose = await request(app)
      .put("/user/")
      .field("jsonTxt", JSON.stringify(editedName));

    expect(respose.statusCode).toBe(201);
    expect(respose.body).toStrictEqual(
      expect.objectContaining({
        name: editedName.userData.name,
        email: originalUser.email,
      })
    );

    const updatedUser = await db.userProfile.findUnique({
      where: { id: global.testUserId },
    });

    expect(updatedUser.name).toEqual(editedName.userData.name);
  });

  test("editing a user with existing email", async () => {
    const editedEmail = {
      userData: {
        email: "bbbwww@example.com",
      },
    };

    const originalUserEmail = await db.userProfile.findUnique({
      where: { id: global.testUserId },
      select: { email: true },
    });

    const response = await request(app)
      .put("/user/")
      .field("jsonTxt", JSON.stringify(editedEmail));

    expect(response.statusCode).toBe(409);
    expect(response.body).toStrictEqual(
      expect.objectContaining({ erro: "Email já em uso." })
    );
    expect(originalUserEmail).not.toBe(editedEmail.userData.email);
  });

  test("editing a user with invalid data", async () => {
    const invalidData = {
      userData: {
        name: 1234,
      },
    };

    const response = await request(app)
      .put("/user/")
      .field("jsonTxt", JSON.stringify(invalidData));

    expect(response.statusCode).toBe(400);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        Erro: "informações faltando ou em formato incorreto.",
        Detalhes: expect.any(Object),
      })
    );
  });

  test("editing a user but an unexpected error occurs", async () => {
    jest.spyOn(manipulatingUser, "edit").mockRejectedValue(new Error());

    const editedName = {
      userData: {
        name: "Novo Nome",
      },
    };

    const response = await request(app)
      .put("/user/")
      .field("jsonTxt", JSON.stringify(editedName));

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  test("editing a user but you are not logged in", async () => {
    jest
      .spyOn(passport, "authenticate")
      .mockImplementation((strategy, callback) => {
        return (req, res, next) => {
          callback(null, false);
        };
      });

    const editedName = {
      userData: {
        name: "Novo Nome",
      },
    };

    const response = await request(app)
      .put("/user/")
      .field("jsonTxt", JSON.stringify(editedName));

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        mensagem: "Acesso negado. Talvez você não esteja logado.",
      })
    );
  });
});

describe("router.delete('/:id', jwtStrategyAuth, userController.deleteUser);", () => {
  test("deleting a user that exists", async () => {
    const userBeforeDeleted = await db.userProfile.findUnique({
      where: { id: global.testUserId },
    });

    const response = await request(app).delete(`/user/${global.testUserId}`);

    const userAfterDeleted = await db.userProfile.findUnique({
      where: { id: global.testUserId },
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(userBeforeDeleted.id);

    expect(userAfterDeleted).toBeNull();
  });

  test("deleting a user that does not exist", async () => {
    const response = await request(app).delete("/user/1");

    expect(response.statusCode).toEqual(404);
    expect(response.body).toStrictEqual(
      expect.objectContaining({ error: "Usuário não encontrado." })
    );
  });

  test("deleting a user but an unexpected error occurs", async () => {
    jest.spyOn(manipulatingUser, "delete").mockRejectedValue(new Error());

    const response = await request(app).delete("/user/1");

    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual(
      expect.objectContaining({
        error: expect.any(String),
      })
    );
  });

  test("deleting a user but you are not logged in", async () => {
    jest
      .spyOn(passport, "authenticate")
      .mockImplementation((strategy, callback) => {
        return (req, res, next) => {
          callback(null, false);
        };
      });

    const response = await request(app).delete(`/user/${global.testUserId}`);

    const user = await db.userProfile.findUnique({
      where: { id: global.testUserId },
    });

    expect(response.statusCode).toBe(401);
    expect(response.body).toStrictEqual(
      expect.objectContaining({
        mensagem: "Acesso negado. Talvez você não esteja logado.",
      })
    );

    expect(user).not.toBeTruthy();
  });
});
