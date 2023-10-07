import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();
app.get("/movies", async (req, res) => {
  const result = await pool.query("SELECT ");
  console.log(result);
  res.send("hola mundo");
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`servidor escuchando en el  puerto ${port}`);
});
