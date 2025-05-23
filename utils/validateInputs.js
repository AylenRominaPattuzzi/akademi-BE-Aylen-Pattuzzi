const HttpError = require("./http-error");

const validateUserInput = (data, isUpdate = false) => {
  const { name, email, password, role } = data;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validRoles = ['admin', 'recepcion'];

  if (!name) return new HttpError('El nombre es requerido', 400);
  if (!email) return new HttpError('El email es requerido', 400);
  if (!emailRegex.test(email)) return new HttpError('El formato del email es inválido', 400);
  if (!isUpdate || password) {
    if (!password) return new HttpError('La contraseña es requerida', 400);
    if (password.length < 8) return new HttpError('La contraseña debe tener al menos 8 caracteres', 400);
  }
  if (!role) return new HttpError('El rol es requerido', 400);
  if (!validRoles.includes(role)) return new HttpError('El rol es inválido', 400);
};

module.exports = validateUserInput;

const validatePatientInput = (data) => {
  const { firstName, lastName, dni, email } = data;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const dniRegex = /^\d{7,10}$/;

  if (!firstName) return new HttpError('El nombre es requerido', 400);
  if (!lastName) return new HttpError('El apellido es requerido', 400);
  if (!dni) return new HttpError('El DNI es requerido', 400);
  if (!dniRegex.test(dni)) return new HttpError('El formato del DNI es inválido', 400);
  if (email && !emailRegex.test(email)) return new HttpError('El formato del email es inválido', 400);
};

module.exports = validatePatientInput;

const validateDoctorInput = (data) => {
  const { firstName, lastName, specialty, phone, email } = data;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!firstName) return new HttpError('El nombre es requerido', 400);
  if (!lastName) return new HttpError('El apellido es requerido', 400);
  if (!specialty) return new HttpError('La especialidad es requerida', 400);
  if (email && !emailRegex.test(email)) return new HttpError('El formato del email es inválido', 400);
  if (!phone) return new HttpError('El telefono es requerido', 400);

}

module.exports = validateDoctorInput;


const mongoose = require('mongoose');
const { APPOINTMENT_STATUS } = require('../models/Appointment'); 

const validateAppointmentInput = (data) => {
  const { patient, doctor, date, status, reason } = data;

  if (!patient) return new HttpError('El paciente es requerido', 400);
  if (!mongoose.Types.ObjectId.isValid(patient)) return new HttpError('ID de paciente inválido', 400);

  if (!doctor) return new HttpError('El médico es requerido', 400);
  if (!mongoose.Types.ObjectId.isValid(doctor)) return new HttpError('ID de médico inválido', 400);

  if (!date) return new HttpError('La fecha es requerida', 400);
  if (isNaN(new Date(date).getTime())) return new HttpError('La fecha no es válida', 400);

  if (status && !Object.values(APPOINTMENT_STATUS).includes(status)) {
    return new HttpError('El estado del turno no es válido', 400);
  }
};

module.exports = validateAppointmentInput;
