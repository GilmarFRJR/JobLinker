import { manipulatingCurriculum } from "../model/curriculumModel.js";
import { createCurriculumSchema } from "../schemas/curriculumSchema.js";

export const curriculumController = {
  updateCurriculum: async (req, res) => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const data = createCurriculumSchema.parse(req.body);

      const curriculum = await manipulatingCurriculum.upsert(userId, data);

      res.status(200).json(curriculum);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  },
};
