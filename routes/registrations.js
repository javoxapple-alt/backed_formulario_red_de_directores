const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const { AREAS } = require('../models/Registration');
const auth = require('../middleware/auth');

// GET /api/registrations/areas — público (el formulario lo necesita)
router.get('/areas', (req, res) => {
  res.json({ success: true, data: AREAS });
});

// POST /api/registrations — público (cualquiera puede registrarse)
router.post('/', async (req, res) => {
  try {
    const registration = new Registration(req.body);
    await registration.save();
    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Ya existe un registro con ese RUT.' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// ── A partir de aquí: solo admins autenticados ────────────────

// GET /api/registrations/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const stats = await Registration.aggregate([
      { $group: { _id: '$area', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    const total = await Registration.countDocuments();
    res.json({ success: true, total, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// GET /api/registrations
router.get('/', auth, async (req, res) => {
  try {
    const filter = {};
    if (req.query.area) filter.area = req.query.area;
    const registrations = await Registration.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// GET /api/registrations/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }
    res.json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

// DELETE /api/registrations/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const registration = await Registration.findByIdAndDelete(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }
    res.json({ success: true, message: 'Registro eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

module.exports = router;
