const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    patient: { type: mongoose.Types.ObjectId, ref: 'Patient', required: true },
    doctor: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['pendiente', 'confirmado', 'cancelado'], default: 'pendiente' },
    reason: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
