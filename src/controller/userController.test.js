import { userController } from "./userController.js";
import { manipulatingUser } from "../model/userModel.js";
import { resize } from "../imageProcessing/multer.js";
import { createUserSchema, updateUserSchema } from "../schemas/userSchemas.js";
import { createCurriculumSchema } from "../schemas/curriculumSchema.js";

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

jest.mock("./manipulatingUser");

describe("testing the userController", () => {
  const req = {
    body: {
      jsonTxt: JSON.stringify(jsonTxt),
    },
    user: {
      id: 1,
    },
  };

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks(); // Limpa os mocks após cada teste
  });

  test("searching for a user with a valid id", async () => {
    manipulatingUser.getOne.mockResolvedValue({ user: "Felps" });

    await userController.getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ user: "Felps" });
  });

  test("searching for a user with an invalid id", () => {});
});
