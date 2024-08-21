import expess from "express";

import { companyController } from "../controller/companyController.js";

import { jwtStrategyAuth } from "../Auth/middleware/authorization.js";

const router = expess.Router();

router.get("/", companyController.searchCompany);
router.get("/all", companyController.getAllCompany);
router.get("/:id", companyController.getCompany);
router.post("/", companyController.createCompany);
router.put("/:id", jwtStrategyAuth, companyController.editCompany);
router.delete("/:id", jwtStrategyAuth, companyController.deleteCompany);

export default router;
