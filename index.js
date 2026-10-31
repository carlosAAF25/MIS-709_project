const express = require('express');
const { Pool } = require('pg');
const path = require('path'); // NUEVO

const app = express();
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Conexión a PostgreSQL vía variables de entorno
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

// Inicializar tabla si no existe
pool.query(`
  CREATE TABLE IF NOT EXISTS tareas (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(255) NOT NULL,
    completada BOOLEAN DEFAULT false
  )
`).catch(err => console.error("Error creando tabla:", err));

// 1. Listar tareas
app.get('/tareas', async (req, res) => {
  const result = await pool.query('SELECT * FROM tareas ORDER BY id ASC');
  res.json(result.rows);
});

// 2. Crear tarea
app.post('/tareas', async (req, res) => {
  const { descripcion } = req.body;
  const result = await pool.query(
    'INSERT INTO tareas (descripcion) VALUES ($1) RETURNING *',
    [descripcion]
  );
  res.status(201).json(result.rows[0]);
});

// 3. Marcar como completada
app.put('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'UPDATE tareas SET completada = true WHERE id = $1 RETURNING *',
    [id]
  );
  res.json(result.rows[0]);
});

app.listen(3000, () => {
  console.log('API de tareas corriendo en el puerto 3000');
});