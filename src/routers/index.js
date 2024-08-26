import expess from "express";

import userRoutes from "./userRoutes.js";
import companyRoutes from "./companyRoutes.js";
import jobRoutes from "./jobRoutes.js";
import curriculumRoutes from "./curriculumRoutes.js";
import applicationRoutes from "./applicationRoutes.js";
import emailRoutes from "./emailRoutes.js";

import { localStrategyAuth } from "../Auth/middleware/validation.js";

const router = expess.Router();

router.post("/JobLinker/login", localStrategyAuth, (req, res) => {
  const token = req.token;
  res.json({ token });
});

router.use("/user", userRoutes);
router.use("/company", companyRoutes);
router.use("/job", jobRoutes);
router.use("/curriculum", curriculumRoutes);
router.use("/application", applicationRoutes);
router.use("/email", emailRoutes);

export default router;
