const Doctor = require('../models/Doctor');
const { Appointment } = require('../models/Appointment');
const HttpError = require('../utils/http-error');
const { paginatedResponse } = require('../utils/paginate');
const validateDoctorInput = require('../utils/validateInputs');


const createDoctor = async (req, res, next) => {
  try {
    validateDoctorInput(req.body)
    const existingDoctor = await Doctor.findOne({
      $or: [
        { email: req.body.email },
      ]
    });
    if (existingDoctor) {
      return next(new HttpError('El doctor ya está registrado', 400));
    }
    const newDoctor = new Doctor(req.body);
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    next(new HttpError(error.message, 400));
  }
};


const listDoctors = async (req, res, next) => {
  try {
    const filter = { active: true };

    if (req.query.specialty) {
      filter.specialty = new RegExp(req.query.specialty, 'i');
    }

    paginatedResponse(req, res, Doctor, filter)
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return next(new HttpError('Doctor no encontrado', 404));
    }
    res.json(doctor);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const updateDoctor = async (req, res, next) => {
  try {
    validateDoctorInput(req.body)
    if (req.body.active === false) {
      const doctorHasAppointments = await Appointment.exists({ doctor: req.params.id });
      if (doctorHasAppointments) {
        return next(new HttpError('No se puede dar de baja a un doctor con turnos asignados', 400));
      }
    }

    const updatedDoctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedDoctor) {
      return next(new HttpError('Doctor no encontrado', 404));
    }
    res.json(updatedDoctor);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

exports.createDoctor = createDoctor;
exports.listDoctors = listDoctors;
exports.getDoctorById = getDoctorById;
exports.updateDoctor = updateDoctor;
