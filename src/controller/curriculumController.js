import { manipulatingCurriculum } from "../model/curriculumModel.js";
import { createCurriculumSchema } from "../schemas/curriculumSchema.js";

export const curriculumController = {
  updateCurriculum: async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        return res.status(403).json("Empresas não podem acessar essa rota");
      }

      const userId = req.user.id;
      const data = createCurriculumSchema.parse(req.body);

      const curriculum = await manipulatingCurriculum.upsert(userId, data);

      res.status(200).json(curriculum);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
