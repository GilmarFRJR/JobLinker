import { manipulatinApplication } from "../model/applicationModel.js";
import { applicationController } from "./applicationController.js";

const req = {
  user: {
    id: 1,
  },
  params: {
    id: 1,
  },
};

const res = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

jest.mock("../model/applicationModel.js");

beforeEach(() => {
  jest.clearAllMocks();
});

describe("applyForJob: async (req, res) => {...}", () => {
  test("applying for a job for the first time", async () => {
    manipulatinApplication.apply.mockResolvedValue({ message: "ok" });

    await applicationController.applyForJob(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: "ok" });
  });

  test("applying for a repeat job", async () => {
    manipulatinApplication.apply.mockResolvedValue(null);

    await applicationController.applyForJob(req, res);

    expect(manipulatinApplication.apply).toHaveBeenCalledWith(
      req.user.id,
      req.params.id
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });

  test("applying for a job  but an unexpected error occurred", async () => {
    manipulatinApplication.apply.mockRejectedValue(new Error());

    await applicationController.applyForJob(req, res);

    expect(manipulatinApplication.apply).toHaveBeenCalledWith(
      req.user.id,
      req.params.id
    );
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: expect.any(String) })
    );
  });
});
