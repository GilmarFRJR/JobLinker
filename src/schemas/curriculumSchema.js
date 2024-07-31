import { z } from "zod";

export const createCurriculumSchema = z.object({
  description: z.string().min(100),
  details: z.string().min(100),
});
