import expess from "express";

import { userController } from "../controller/userController.js";

const router = expess.Router();

router.get("/all", userController.getUsers);
router.get("/:id", userController.getUser);
router.get("/jobs/:id", userController.getApplication);
router.post("/", userController.createUser);
router.put("/:id", userController.editUser);
router.delete("/:id", userController.deleteUser);

export default router;
