import expess from "express";

import { userController } from "../controller/userController.js";

import { jwtStrategyAuth } from "../Auth/middleware/authorization.js";

import { upload } from "../imageProcessing/multer.js";

const router = expess.Router();

router.get("/all", jwtStrategyAuth, userController.getUsers);
router.get("/:id", jwtStrategyAuth, userController.getUser);
router.get("/jobs/:id", jwtStrategyAuth, userController.getApplication);
router.post("/", upload.single("perfil"), userController.createUser);
router.put(
  "/",
  jwtStrategyAuth,
  upload.single("perfil"),
  userController.editUser
);
router.delete("/:id", jwtStrategyAuth, userController.deleteUser);

export default router;
