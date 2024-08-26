import expess from "express";

import { sendEmail } from "../services/emailBuilder.js";

const router = expess.Router();

router.post("/send", sendEmail.send);

export default router;
