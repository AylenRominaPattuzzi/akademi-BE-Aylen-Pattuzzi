const Appointment = require('../models/Appointment');
const HttpError = require('../utils/http-error');

const createAppointment = async (req, res, next) => {
  const { patient, doctor, date, reason } = req.body;

  try {
    const overlappingAppointment = await Appointment.findOne({ doctor, date: new Date(date), });

    if (overlappingAppointment) {
      return next(new HttpError('El doctor no está disponible en esa fecha y hora', 400));
    }

    const newAppointment = new Appointment({
      patient,
      doctor,
      date: new Date(date),
      reason,
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const listAppointments = async (req, res, next) => {
  const { patient, doctor } = req.query;

  if (!patient || !doctor) {
    return next(new HttpError('Filtros "patient" y "doctor" son obligatorios', 400));
  }

  try {
    const appointments = await Appointment.find({ patient, doctor })
      .populate('patient')
      .populate('doctor');
    res.json(appointments);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return next(new HttpError('Turno no encontrado', 404));
    }

    res.json(appointment);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const updateAppointmentStatus = async (req, res, next) => {
  const { status } = req.body;

  if (!['confirmado', 'cancelado'].includes(status)) {
    return next(new HttpError('Estado inválido', 400));
  }

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedAppointment) {
      return next(new HttpError('Turno no encontrado', 404));
    }

    res.json(updatedAppointment);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

exports.createAppointment = createAppointment;
exports.listAppointments = listAppointments;
exports.getAppointmentById = getAppointmentById;
exports.updateAppointmentStatus = updateAppointmentStatus;
