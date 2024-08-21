import { manipulatinApplication } from "../model/applicationModel.js";

export const applicationController = {
  applyForJob: async (req, res) => {
    const userId = req.user.id;
    const jobId = parseInt(req.params.id, 10);

    try {
      const application = await manipulatinApplication.apply(userId, jobId);

      if (!application)
        return res
          .status(400)
          .json({ error: "Você já se candidatou a essa vaga." });

      res.status(201).json(application);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
