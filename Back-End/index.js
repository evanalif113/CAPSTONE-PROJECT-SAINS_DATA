const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 2518;

// ===== Middleware =====
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false }));
app.use(bodyParser.json()); // Untuk parsing JSON

// ===== Koneksi MySQL =====
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DB_JAMUR'
});

// ===== ROUTE: GET kirim via URL-encoded =====
// contoh: GET /api/data-sensor/send?id_sensor=1&temperature=24.5&humidity=60&moisture=30&light=500
app.get('/api/data-sensor/send', (req, res) => {
  const { id_sensor, temperature, humidity, moisture, light } = req.query;

  if ( !id_sensor || !temperature || !humidity || !moisture || !light) {
    return res.status(400).send('Semua parameter (id_sensor, temperature, humidity, moisture, light) wajib diisi.');
  }

  const sql = `
    INSERT INTO DATA_SENSOR (id_sensor, temperature, humidity, moisture, light) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [id_sensor, temperature, humidity, moisture, light], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal menyimpan data.');
    }
    console.log(`Data berhasil disimpan (GET): id_sensor=${id_sensor}, temperature=${temperature}, humidity=${humidity}, moisture=${moisture}, light=${light}`);
    res.send(`Data diterima via GET: 
      id_sensor=${id_sensor},
      temperature=${temperature}, 
      humidity=${humidity}, 
      moisture=${moisture}, 
      light=${light}`);
  });
});



// ===== ROUTE: POST kirim via JSON =====
// contoh: POST /api/data-sensor/send dengan body: { "temperature": 24.5, "humidity": 60, "moisture": 30, "light": 500 }
app.post('/api/data-sensor/send', (req, res) => {
  const { id_sensor, temperature, humidity, moisture, light } = req.body;

  if (!id_sensor || !temperature || !humidity || !moisture || !light) {
    return res.status(400).send('Semua parameter (id_sensor, temperature, humidity, moisture, light) wajib diisi.');
  }

  const sql = `
    INSERT INTO DATA_SENSOR (id_sensor, temperature, humidity, moisture, light) 
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [id_sensor, temperature, humidity, moisture, light], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal menyimpan data.');
    }
    console.log(`Data berhasil disimpan (POST): id_sensor=${id_sensor}, temperature=${temperature}, humidity=${humidity}, moisture=${moisture}, light=${light}`);
    res.send(`Data diterima via POST: 
      id_sensor=${id_sensor},
      temperature=${temperature}, 
      humidity=${humidity}, 
      moisture=${moisture}, 
      light=${light}`);
  });
});

// ===== ROUTE: GET ambil semua data =====
// GET /api/data/all
app.get('/api/data/all', (req, res) => {
  const sql = `
    SELECT id_sensor, temperature, humidity, moisture, light, created_at 
    FROM DATA_SENSOR 
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal mengambil data.');
    }
    res.json(results);
  });
});

// ===== ROUTE: GET ambil satu record by ID =====
// GET /api/data/:id
app.get('/api/data/id', (req, res) => {
  const id = req.params.id;
  const sql = `
    SELECT id_sensor, temperature, humidity, moisture, light, created_at 
    FROM DATA_SENSOR 
    WHERE id_sensor = ?
  `;

  db.query(sql, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Gagal mengambil data.');
    }
    if (results.length === 0) {
      return res.status(404).send('Data tidak ditemukan.');
    }
    res.json(results[0]);
  });
});

// ===== Start Server =====
app.listen(port, function () {
  console.log(`Server berjalan di http://localhost:${port}`);
  console.log(`Kirim data via GET  : /api/data-sensor/send?temperature=..&humidity=..&moisture=..&light=..`);
  console.log(`Kirim data via POST : /api/data-sensor/send (body JSON)`);
  console.log(`Ambil semua data     : /api/data/all`);
  console.log(`Ambil data by ID     : /api/data/:id`);
});