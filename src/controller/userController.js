import { z } from "zod";

import { manipulatingUser } from "../model/userModel.js";

import { createUserSchema, updateUserSchema } from "../schemas/userSchemas.js";
import { createCurriculumSchema } from "../schemas/curriculumSchema.js";

export const userController = {
  getUser: async (req, res) => {
    const id = parseInt(req.params.id, 10);

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
      const userData = createUserSchema.parse(req.body.userData);
      const curriculumData = createCurriculumSchema.parse(
        req.body.curriculumData
      );

      const user = await manipulatingUser.create(userData, curriculumData);

      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  editUser: async (req, res) => {
    try {
      const id = updateUserSchema.parse(parseInt(req.params.id, 10));
      const data = req.body;

      const editedUser = await manipulatingUser.edit(id, data);

      if (!editedUser)
        return res.status(404).json({ error: "Usuário não encontrado." });

      res.status(200).json(editedUser);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      res.status(500).json({ error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    const id = parseInt(req.params.id, 10);

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
    const userId = parseInt(req.params.id, 10);

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
