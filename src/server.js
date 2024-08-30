import dotenv from "dotenv";

import app from "./app.js";

dotenv.config();

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}/`);
});
