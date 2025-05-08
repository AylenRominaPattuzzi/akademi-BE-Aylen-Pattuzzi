const mongoose = require('mongoose');

const PatientSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  dni: { type: String, required: true },
  email: { type: String },
  medicalCoverage: { type: String }
});

module.exports = mongoose.model('Patient', PatientSchema);
