const Doctor = require('../models/Doctor');
const HttpError = require('../utils/http-error');


const createDoctor = async (req, res, next) => {
  try {
    const existingDoctor = await Doctor.findOne({ email: req.body.email });
    if (existingDoctor) {
      return next(new HttpError('El correo electrónico ya está registrado', 400));
    }
    const newDoctor = new Doctor(req.body);
    const savedDoctor = await newDoctor.save();
    res.status(201).json(savedDoctor);
  } catch (error) {
    next(new HttpError(error.message, 400));
  }
};


//TODO: Paginacion
const listDoctors = async (req, res, next) => {
  try {
    const filter = {};

    if (req.query.specialty) {
      filter.specialty = req.query.specialty;
    }

    const doctors = await Doctor.find(filter);
    res.json(doctors);
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
