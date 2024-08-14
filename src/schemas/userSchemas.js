import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(4),
  age: z.number().min(14),
  profilePhotoReference: z.string().optional(),
  description: z.string().optional(),
  fieldOfWork: z.string(),
  technologies: z.record(z.boolean()),
});

export const updateUserSchema = z.object({
  name: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(4).optional(),
  age: z.number().min(14).optional(),
  profilePhotoReference: z.string().optional(),
  description: z.string().optional(),
  fieldOfWork: z.string().optional(),
  technologies: z.record(z.boolean()).optional(),
});
