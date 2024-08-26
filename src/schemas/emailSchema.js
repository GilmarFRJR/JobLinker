import { z } from "zod";

export const createMessageSchema = z.object({
  userEmails: z.array(z.string().email()),
  companyEmail: z.string().email(),
  subject: z.string().min(15),
  email: z.string().max(1500),
});
