import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { ZodError } from "zod";

import { createMessageSchema } from "../schemas/emailSchema.js";

dotenv.config();

const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = {
  send: async (req, res) => {
    try {
      const userEmails = createMessageSchema.parse(req.body.userEmails);

      const message = {
        from: "JobLinker <joblinker@gmail.com>",
        to: userEmails.join(","),
        replyTo: req.body.companyEmail,
        subject: req.body.subject,
        html: req.body.email,
        text: req.body.email,
      };

      const info = await transport.sendMail(message);

      res.status(200).json({ mensagem: "Tudo certo!" });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          Erro: "informações faltando ou em formato incorreto. Detalhes:",
          error,
        });
      }

      res.status(500).json({ error: error.message });
    }
  },
};
