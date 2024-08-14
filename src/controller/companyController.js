import { z } from "zod";
import bcrypt from "bcrypt";

import { manipulatingCompany } from "../model/companyModel.js";

import {
  createCompanySchema,
  updateCompanySchema,
} from "../schemas/companySchema.js";

export const companyController = {
  getCompany: async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
      const company = await manipulatingCompany.getOne(id);

      if (!company)
        return res.status(404).json({ error: "Empresa não encontrada." });

      res.status(200).json(company);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getAllCompany: async (req, res) => {
    try {
      const companies = await manipulatingCompany.getAll();

      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  searchCompany: async (req, res) => {
    const nameSearch = req.query.name;

    try {
      const companies = await manipulatingCompany.search(nameSearch);

      if (!companies)
        return res.status(404).json({ error: "Empresa não encontrada." });

      res.status(200).json(companies);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCompany: async (req, res) => {
    try {
      const data = createCompanySchema.parse(req.body);

      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);

      const company = await manipulatingCompany.create(data);

      if (company) {
        res.status(201).json(company);
      } else {
        res.status(409).json({ erro: "Empresa já registrada" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  editCompany: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const data = updateCompanySchema.parse(req.body);

      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);

      const editedCompany = await manipulatingCompany.edit(id, data);

      if (editedCompany) {
        res.status(201).json(editedCompany);
      } else {
        res.status(409).json({
          erro: "Esses novos dados já são usados por outra empresa (nome ou CNPJ",
        });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteCompany: async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
      const deleteCompany = await manipulatingCompany.delete(id);

      res.status(200).json(deleteCompany);
    } catch (error) {
      if (error.code === "P2025") {
        res.status(404).json({ error: "Usuário não encontrado." });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },
};
