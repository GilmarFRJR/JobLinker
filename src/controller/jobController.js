import { z } from "zod";

import { manipulatingJob } from "../model/jobModel.js";
import { createJobSchema, editJobSchema } from "../schemas/jobSchema.js";

export const jobController = {
  getJob: async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
      const job = await manipulatingJob.getOne(id);

      if (!job) return res.status(404).json("Essa vaga não existe.");

      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getJobs: async (req, res) => {
    const page = req.query.page || 1;
    const filter = req.query.filter || null;

    try {
      const { jobs, totalJobs, totalPages, currentPage } =
        await manipulatingJob.getAll(page, filter);

      res.status(200).json({
        jobs,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getJobsCompany: async (req, res) => {
    const companyId = parseInt(req.params.id, 10);

    try {
      const jobs = await manipulatingJob.getJobsCompany(companyId);

      if (jobs.length === 0)
        return res.status(404).json("Essa vaga não existe.");

      res.status(200).json(jobs);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createJob: async (req, res) => {
    try {
      const companyId = parseInt(req.params.id, 10);
      const data = createJobSchema.parse(req.body);

      const job = await manipulatingJob.create(companyId, data);

      res.status(201).json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  editJob: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const data = editJobSchema.parse(req.body);

      const job = await manipulatingJob.edit(id, data);

      if (!job) return res.status(404).json("Essa vaga não existe.");

      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  deleteJob: async (req, res) => {
    const id = parseInt(req.params.id, 10);

    try {
      const job = await manipulatingJob.delete(id);

      if (!job) return res.status(404).json("Essa vaga não existe.");

      res.status(200).json(job);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getApplication: async (req, res) => {
    const jobId = parseInt(req.params.id, 10);

    try {
      const applications = await manipulatingJob.applicationsJobs(jobId);

      res.status(200).json(applications);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};
