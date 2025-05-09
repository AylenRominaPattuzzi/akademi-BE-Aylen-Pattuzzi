const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const APPOINTMENT_STATUS = {
  PENDING: 'pendiente',
  CONFIRMED: 'confirmado',
  CANCELED: 'cancelado'
};

const appointmentSchema = new Schema({
  patient: { type: mongoose.Types.ObjectId, ref: 'Patient', required: true },
  doctor: { type: mongoose.Types.ObjectId, ref: 'Doctor', required: true },
  date: { type: Date, required: true },
  status: {
    type: String,
    enum: Object.values(APPOINTMENT_STATUS),
    default: APPOINTMENT_STATUS.PENDING
  },
  reason: { type: String, default: '' }
}, { timestamps: true });

module.exports = {
  Appointment: mongoose.model('Appointment', appointmentSchema),
  APPOINTMENT_STATUS
};
