import { z } from "zod";

export const createJobSchema = z.object({
  description: z.string().min(100),
  details: z.string().min(100),
  jobType: z.enum(["CLT", "PJ", "JOVEM_APRENDIZ"]),
});

export const editJobSchema = z.object({
  description: z.string().min(100).optional(),
  details: z.string().min(100).optional(),
  jobType: z.enum(["CLT", "PJ", "JOVEM_APRENDIZ"]).optional(),
});
