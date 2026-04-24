/**
 * Script para crear el primer usuario administrador.
 * Ejecutar UNA sola vez:  node scripts/createAdmin.js
 */
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/encuentro-red';

// ── CONFIGURA TUS DATOS AQUÍ ──────────────────────────────────
const ADMIN = {
  nombre:   'Administrador Red',
  email:    'admin@red.cl',
  password: 'Admin2026!',
};
// ─────────────────────────────────────────────────────────────

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ Conectado a MongoDB');

  const existe = await User.findOne({ email: ADMIN.email });
  if (existe) {
    console.log('⚠️  Ya existe un usuario con ese email:', ADMIN.email);
    process.exit(0);
  }

  const user = new User(ADMIN);
  await user.save();
  console.log('✅ Usuario admin creado:');
  console.log('   Email:    ', ADMIN.email);
  console.log('   Password: ', ADMIN.password);
  console.log('\n⚠️  Cambia la contraseña después del primer login.');
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
