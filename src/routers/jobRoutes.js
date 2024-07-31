import expess from "express";

import { jobController } from "../controller/jobController.js";

const router = expess.Router();

router.get("/all", jobController.getJobs);
router.get("/:id", jobController.getJob);
router.get("/company/:id", jobController.getJobsCompany);
router.get("/jobs/:id", jobController.getApplication);
router.post("/:id", jobController.createJob);
router.put("/:id", jobController.editJob);
router.delete("/:id", jobController.deleteJob);

export default router;
