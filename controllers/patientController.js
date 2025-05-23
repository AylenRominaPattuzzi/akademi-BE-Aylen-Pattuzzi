const { validationResult } = require('express-validator');
const Patient = require('../models/Patient');
const HttpError = require('../utils/http-error');
const { paginatedResponse } = require('../utils/paginate');
const validatePatientInput = require('../utils/validateInputs');

const createPatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }
  try {
    validatePatientInput(req.body);
    const existingPatient = await Patient.findOne({
      $or: [
        { email: req.body.email },
        { dni: req.body.dni }
      ]
    });
    if (existingPatient) {
      return next(new HttpError('Ya existe un paciente con ese correo electrónico o DNI', 400));
    }
    const newPatient = new Patient(req.body);
    const savePatient = await newPatient.save();
    res.status(201).json(savePatient);
  } catch (error) {
    next(new HttpError(error.message, 400));
  }
};

const listPatients = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.firstName) filter.firstName = req.query.firstName;
    if (req.query.dni) filter.dni = req.query.dni;
    if (req.query.medicalCoverage) filter.medicalCoverage = req.query.medicalCoverage;

    const { data, total, page, limit, totalPages } = await paginatedResponse(Patient, req.query, filter);
    res.json({ data, total, page, limit, totalPages });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return next(new HttpError('Paciente no encontrado', 404));
    }
    res.json(patient);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const updatePatient = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError(errors.array()[0].msg, 422));
  }
  try {
    validatePatientInput(req.body);
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) {
      return next(new HttpError('Paciente no encontrado', 404));
    }
    res.json(updatedPatient);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const deleted = await Patient.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return next(new HttpError('Paciente no encontrado', 404));
    }
    res.json({ message: 'Paciente eliminado' });
  } catch (error) {
    next(new HttpError(error.message, 400));
  }
};

exports.createPatient = createPatient;
exports.listPatients = listPatients;
exports.getPatientById = getPatientById;
exports.updatePatient = updatePatient;
exports.deletePatient = deletePatient;