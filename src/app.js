import express from "express";
import cors from "cors";
import { pool } from "./db.js";

const app = express();

app.use(express.json());

app.use(cors());

app.get("/movies", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM movies");
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No se encontro ninguna pelicula ",
      });
    }
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.get("/movies/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool.query(
      "SELECT * FROM movies WHERE id_movie = $1",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "No se encontro ninguna pelicula",
      });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.post("/movies", async (req, res) => {
  const { title, genre, age, rating, image } = req.body;

  if (!title || !genre || !age || !rating || !image) {
    return res.status(400).json({
      message: "Petición invalida",
    });
  }

  try {
    const result = await pool.query(
      "INSERT INTO movies (title, genre, age, rating, image ) VALUES($1, $2, $3, $4, $5 ) RETURNING *",
      [title, genre, age, rating, image]
    );
    res.status(201).json({
      message: "pelicula creada exitosamente",
      body: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.put("/movies/:id", async (req, res) => {
  const id = req.params.id;
  const { title, genre, age, rating, image } = req.body;
  if (!title || !genre || !age || !rating || !image) {
    return res.status(400).json({
      message: "Petición invalida",
    });
  }
  try {
    const result = await pool.query(
      "UPDATE movies SET title = $1, genre = $2, age = $3, rating = $4, image = $5  WHERE id_movie = $6 RETURNING *",
      [title, genre, age, rating, image, id]
    );
    res.json({
      message: "pelicula actualizada exitosamente",
      body: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.delete("/movies/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool.query("DELETE FROM movies WHERE id_movie = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "No se encontró ninguna  pelicula con el ID proporcionado.",
      });
    }

    // Devolver una respuesta exitosa sin contenido (204)
    res.sendStatus(204);
  } catch (error) {
    // Si hubo un error, devolver el error
    console.error("Error al eliminar la pelicula :", error);
    res.status(500).json({
      message: error.message,
    });
  }
});

app.use((req, res) => {
  res.status(404).json({
    message: "Recurso no encontrado",
  });
});

const port = process.env.PORT ?? 3001;

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
