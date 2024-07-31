import expess from "express";

import { applicationController } from "../controller/applicationController.js";

const router = expess.Router();

router.post("/", applicationController.applyForJob);

export default router;
