import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  age: z.number().min(14),
  description: z.string().optional(),
  fieldOfWork: z.string(),
  technologies: z.record(z.boolean()),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  age: z.string().min(14).optional(),
  description: z.string().optional(),
  fieldOfWork: z.string().optional(),
  technologies: z.record(z.boolean()).optional(),
});
