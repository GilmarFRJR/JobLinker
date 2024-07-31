import expess from "express";

import { companyController } from "../controller/companyController.js";

const router = expess.Router();

router.get("/", companyController.searchCompany);
router.get("/all", companyController.getAllCompany);
router.get("/:id", companyController.getCompany);
router.post("/", companyController.createCompany);
router.put("/:id", companyController.editCompany);
router.delete("/:id", companyController.deleteCompany);

export default router;
