require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/encuentro-red';

// Permitir todos los orígenes
app.use(cors());
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