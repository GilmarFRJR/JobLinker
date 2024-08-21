import expess from "express";

import { curriculumController } from "../controller/curriculumController.js";

import { jwtStrategyAuth } from "../Auth/middleware/authorization.js";

const router = expess.Router();

router.post("/", jwtStrategyAuth, curriculumController.updateCurriculum); //só usuário

export default router;
