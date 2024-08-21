import expess from "express";

import userRoutes from "./userRoutes.js";
import companyRoutes from "./companyRoutes.js";
import jobRoutes from "./jobRoutes.js";
import curriculumRoutes from "./curriculumRoutes.js";
import applicationRoutes from "./applicationRoutes.js";

import { localStrategyAuth } from "../Auth/middleware/validation.js";
import { jwtStrategyAuth } from "../Auth/middleware/authorization.js";

const router = expess.Router();

router.post("/JobLinker/login", localStrategyAuth, (req, res) => {
  const token = req.token;
  res.json({ token });
});

router.get("/teste", jwtStrategyAuth, (req, res) => {
  const data = req.company || req.user;

  res.json(req.user.id);
});

router.use("/user", userRoutes);
router.use("/company", companyRoutes);
router.use("/job", jobRoutes);
router.use("/curriculum", curriculumRoutes);
router.use("/application", applicationRoutes);

export default router;
