const mongoose = require('mongoose');

const AREAS = [
  { nombre: 'Convivencia Educativa',       sede: 'Colegio Metodista Robert Johnson' },
  { nombre: 'PIE',                          sede: 'Colegio Católico Nazaret' },
  { nombre: 'Docentes y Coordinadores TP', sede: 'Liceo Bicentenario Nirvana' },
  { nombre: 'Educ. Parvularia',            sede: 'Colegio San Antonio de Matilla' },
  { nombre: 'Inglés',                      sede: 'Liceo Bicentenario Kronos' },
  { nombre: 'UTP/Equipos Técnicos',        sede: 'Colegio Bicentenario William Taylor' },
  { nombre: 'Coordinadores Extraescolar',  sede: 'Colegio Marista Hermano Fernando' },
  { nombre: 'Directores y Directoras',     sede: 'Colegio Bicentenario William Taylor' },
  { nombre: 'CGPA',                        sede: 'Colegio Rupanic School' },
];

const registrationSchema = new mongoose.Schema(
  {
    nombreCompleto: {
      type: String,
      required: [true, 'El nombre completo es obligatorio'],
      trim: true,
    },
    rut: {
      type: String,
      required: [true, 'El RUT es obligatorio'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Ingresa un correo electrónico válido'],
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
    },
    colegioOrigen: {
      type: String,
      required: [true, 'El colegio de origen es obligatorio'],
      trim: true,
    },
    comunaOrigen: {
      type: String,
      trim: true,
      enum: ['Alto Hospicio', 'Iquique', 'Otro', ''],
      default: '',
    },
    cargo: {
      type: String,
      required: [true, 'El cargo es obligatorio'],
      enum: [
        'Director/a',
        'Jefe/a UTP',
        'Coordinador/a',
        'Docente',
        'Asistente de la Educación',
        'Otro',
      ],
    },
    area: {
      type: String,
      required: [true, 'El área de participación es obligatoria'],
      enum: AREAS.map((a) => a.nombre),
    },
  },
  {
    timestamps: true,
  }
);

// Virtual para obtener la sede según el área
registrationSchema.virtual('sede').get(function () {
  const found = AREAS.find((a) => a.nombre === this.area);
  return found ? found.sede : '';
});

registrationSchema.set('toJSON', { virtuals: true });
registrationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Registration', registrationSchema);
module.exports.AREAS = AREAS;
