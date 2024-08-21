import expess from "express";

import { applicationController } from "../controller/applicationController.js";

import { jwtStrategyAuth } from "../Auth/middleware/authorization.js";

const router = expess.Router();

router.post("/:id", jwtStrategyAuth, applicationController.applyForJob);

export default router;
