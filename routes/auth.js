const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto_local';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
    }

    const esValida = await user.compararPassword(password);
    if (!esValida) {
      return res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, nombre: user.nombre },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      success: true,
      token,
      user: { id: user._id, nombre: user.nombre, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error del servidor.' });
  }
});

// GET /api/auth/me — verificar token activo
router.get('/me', authMiddleware, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
