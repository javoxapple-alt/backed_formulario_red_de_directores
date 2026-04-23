require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/encuentro-red';

// CORS: permite el frontend de Railway y localhost en desarrollo
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,         // ej: https://frontformularioreddedirectores-production.up.railway.app
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permitir requests sin origin (Postman, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // En desarrollo sin FRONTEND_URL, permitir todo
    if (!process.env.FRONTEND_URL) return callback(null, true);
    callback(new Error('CORS: origen no permitido: ' + origin));
  },
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/registrations', require('./routes/registrations'));

app.get('/', (req, res) => {
  res.json({ message: 'API I Encuentro de la Red 2026 — OK' });
});

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB');
    app.listen(PORT, () => console.log(`🚀 Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => { console.error('❌ MongoDB:', err.message); process.exit(1); });
