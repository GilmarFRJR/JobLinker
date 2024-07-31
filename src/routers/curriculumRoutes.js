import expess from "express";

import { curriculumController } from "../controller/curriculumController.js";

const router = expess.Router();

router.post("/:userId", curriculumController.updateCurriculum);

export default router;
