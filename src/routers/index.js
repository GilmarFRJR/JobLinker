import expess from "express";

import userRoutes from "./userRoutes.js";
import companyRoutes from "./companyRoutes.js";
import jobRoutes from "./jobRoutes.js";
import curriculumRoutes from "./curriculumRoutes.js";
import applicationRoutes from "./applicationRoutes.js";

import { localStrategyAuth } from "../Auth/middleware/validation.js";
import { jwtStrategyAuth } from "../Auth/middleware/authorization.js";

const router = expess.Router();

router.post("/teste", localStrategyAuth, (req, res) => {
  const token = req.token;
  res.json({ token });
});

router.get("/privado", jwtStrategyAuth, (req, res) => {
  const data = req.user;

  res.json({ Mensagem: "Acessou!", dados: data });
});

router.use("/user", userRoutes);
router.use("/company", companyRoutes);
router.use("/job", jobRoutes);
router.use("/curriculum", curriculumRoutes);
router.use("/application", applicationRoutes);

export default router;
