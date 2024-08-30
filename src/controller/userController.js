import bcrypt from "bcrypt";
import { ZodError } from "zod";

import { manipulatingUser } from "../model/userModel.js";
import { resize } from "../imageProcessing/multer.js";

import { createUserSchema, updateUserSchema } from "../schemas/userSchemas.js";
import { createCurriculumSchema } from "../schemas/curriculumSchema.js";

export const userController = {
  getUser: async (req, res) => {
    const id = parseInt(req.params.id, 10) || req.user.id;

    try {
      const user = await manipulatingUser.getOne(id);

      if (!user)
        return res.status(404).json({ error: "Usuário não encontrado." });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getUsers: async (req, res) => {
    try {
      const users = await manipulatingUser.getAll();

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const data = JSON.parse(req.body.jsonTxt);
      const userData = createUserSchema.parse(data.userData);
      const curriculumData = data.curriculumData;

      if (curriculumData) {
        curriculumData = createCurriculumSchema.parse(curriculumData);
      }

      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);

      if (req.file) {
        userData.profilePhotoReference = req.file.filename;

        resize(req.file);
      }

      const user = await manipulatingUser.create(userData, curriculumData);

      if (user) {
        res.status(201).json(user);
      } else {
        res.status(409).json({ erro: "Email já em uso." });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          Erro: "informações faltando ou em formato incorreto.",
          Detalhes: error,
        });
      }
      res.status(500).json({ error: error.message });
    }
  },

  editUser: async (req, res) => {
    try {
      const id = req.user.id;
      const dataNotVerified = JSON.parse(req.body.jsonTxt);
      const data = updateUserSchema.parse(dataNotVerified.userData);

      if (req.file) {
        data.profilePhotoReference = req.file.filename;

        await resize(req.file.path);
      }

      console.log(req.file.filename);

      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }

      const editedUser = await manipulatingUser.edit(id, data);

      if (editedUser) {
        res.status(201).json(editedUser);
      } else {
        res.status(409).json({ erro: "Email já em uso." });
      }
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          Erro: "informações faltando ou em formato incorreto.",
          Detalhes: error,
        });
      }
      res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    const id = parseInt(req.params.id, 10) || req.user.id;

    try {
      const deleteUser = await manipulatingUser.delete(id);
      res.status(200).json(deleteUser);
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Usuário não encontrado." });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  getApplication: async (req, res) => {
    const userId = parseInt(req.params.id, 10) || req.user.id;

    try {
      const applications = await manipulatingUser.applicationsUser(userId);

      if (!applications)
        res.status(404).json({ error: "Usuário não encontrado." });

      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
