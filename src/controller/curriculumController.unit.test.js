import { ZodError } from "zod";

import { manipulatingCurriculum } from "../model/curriculumModel.js";
import { createCurriculumSchema } from "../schemas/curriculumSchema.js";

const req = {
  body: {
    curriculum: "Meu currículo",
  },
  user: {
    id: 1,
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

jest.mock("../model/curriculumModel.js");
jest.mock("../schemas/curriculumSchema.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("updateCurriculum: async (req, res) => {...}", () => {
  test("creating a curriculum with valid data", async () => {});

  test("creating a curriculum with invalid data", async () => {});

  test("creating a curriculum as a company and not a user", async () => {});

  test("creating a resume with valid data but an unexpected error occurs", async () => {});
});
