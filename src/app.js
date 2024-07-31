import expess from "express";
import dotenv from "dotenv";

import routers from "./routers/index.js";

const app = expess();

app.use(expess.json());
app.use(expess.urlencoded({ extended: true }));

dotenv.config();

app.use(routers);

app.listen(process.env.PORT, () => {
  console.log(`Servidor rodando em http://localhost:${process.env.PORT}/`);
});
