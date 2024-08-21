import expess from "express";

import { jobController } from "../controller/jobController.js";

import { jwtStrategyAuth } from "../Auth/middleware/authorization.js";

const router = expess.Router();

router.get("/all", jobController.getJobs);
router.get("/:id", jwtStrategyAuth, jobController.getJob);
router.get("/company/:id", jwtStrategyAuth, jobController.getJobsCompany);
router.get("/jobs/:id", jwtStrategyAuth, jobController.getApplication); //só empresa
router.post("/", jwtStrategyAuth, jobController.createJob); //só empresa
router.put("/", jwtStrategyAuth, jobController.editJob); //só empresa
router.delete("/", jwtStrategyAuth, jobController.deleteJob); //só empresa

export default router;
