const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dni: { type: String, required: true, unique: true },
  email: { type: String },
  phone: { type: String },
  medicalCoverage: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Patient', PatientSchema);