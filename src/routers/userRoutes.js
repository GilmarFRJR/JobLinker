import expess from "express";
import multer, { MulterError } from "multer";

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

const erroHandler = (err, req, res, next) => {
  console.log(err); // Log completo do erro
  console.log(err instanceof MulterError); // Verifica se é uma instância de MulterError
  console.log(err.name); // Nome do erro
  res.status(400);

  if (err.message === "Multer") {
    res.json({ Erro: "Imagem em formato inválido" });
  } else {
    res.json({ Erro: "Ouve algum erro, tente novamente mais tarde." });
  }
};

router.use(erroHandler);

export default router;
