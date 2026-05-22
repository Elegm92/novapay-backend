import express from "express";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const { Pool } = pg;

const PORT = process.env.PORT || 3000;

console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Servidor funcionando",
  });
});

app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      ok: true,
      message: "Conexión correcta con Supabase",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error completo:", error);

    res.status(500).json({
      ok: false,
      error: error.message,
      code: error.code,
      hostname: error.hostname,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}/db-test`);
});
