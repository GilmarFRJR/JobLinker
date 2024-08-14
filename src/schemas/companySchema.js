import { z } from "zod";

export const createCompanySchema = z.object({
  name: z.string().min(3),
  description: z.string().min(100),
  CNPJ: z.string(),
  password: z.string().min(5),
  foundation: z.string(),
  hiring: z.boolean().optional(),
});

export const updateCompanySchema = z.object({
  name: z.string().min(3).optional(),
  description: z.string().min(100).optional(),
  CNPJ: z.string().optional(),
  password: z.string().min(5).optional(),
  foundation: z.string().optional(),
  hiring: z.boolean().optional(),
});
