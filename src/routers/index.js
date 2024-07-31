import expess from "express";

import userRoutes from "./userRoutes.js";
import companyRoutes from "./companyRoutes.js";
import jobRoutes from "./jobRoutes.js";
import curriculumRoutes from "./curriculumRoutes.js";
import applicationRoutes from "./applicationRoutes.js";

const router = expess.Router();

router.use("/user", userRoutes);
router.use("/company", companyRoutes);
router.use("/job", jobRoutes);
router.use("/curriculum", curriculumRoutes);
router.use("/application", applicationRoutes);

export default router;
