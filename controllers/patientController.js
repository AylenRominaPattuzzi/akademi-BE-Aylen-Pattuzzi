const Patient = require('../models/Patient');
const HttpError = require('../utils/http-error');

const createPatient = async (req, res, next) => {
  try {
    const existingPatient = await Patient.findOne({ email: req.body.email });
    if (existingPatient) {
      return next(new HttpError('El correo electrónico ya está registrado', 400));
    }
    const newPatient = new Patient(req.body);
    const savePatient = await newPatient.save();
    res.status(201).json(savePatient);
  } catch (error) {
    next(new HttpError(error.message, 400));
  }
};

//TODO: Paginacion
const listPatients = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.name) {
      filter.firstName = new RegExp(req.query.name, 'i');
    }
    if (req.query.dni) {
      filter.dni = req.query.dni;
    }
    if (req.query.medicalCoverage) {
      filter.medicalCoverage = req.query.medicalCoverage;
    }

    const patients = await Patient.find(filter);
    res.json(patients);
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


//REVISAR!!
const updatePatient = async (req, res, next) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) {
      return next(new HttpError('Paciente no encontrado', 404));
    }
    res.json(updatedPatient);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


//REVISAR!!
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
exports.listPatients =listPatients;
exports.getPatientById = getPatientById;
exports.updatePatient = updatePatient;
exports.deletePatient = deletePatient;