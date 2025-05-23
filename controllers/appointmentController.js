const { Appointment } = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const HttpError = require('../utils/http-error');
const { APPOINTMENT_STATUS } = require('../models/Appointment');
const { paginatedResponse } = require('../utils/paginate');
const { default: mongoose } = require('mongoose');
const sendEmail = require('../utils/sendEmail');
const { appointmentReminderEmail } = require('../utils/emails/appointmentReminderEmail');

const createAppointment = async (req, res, next) => {

  try {
    validateDoctorInput(req.body)
    const appointmentDate = new Date(date);

    if (appointmentDate <= new Date()) {
      return next(new HttpError('La fecha del turno debe ser futura', 400));
    }

    const doctorExists = await Doctor.findById(doctor);
    if (!doctorExists || !doctorExists.active) {
      return next(new HttpError('El doctor no existe o está inhabilitado', 400));
    }

    const patientExists = await Patient.findById(patient);
    if (!patientExists) {
      return next(new HttpError('El paciente no existe', 400));
    }

    const overlappingAppointment = await Appointment.findOne({ doctor, date: appointmentDate, status: { $ne: 'cancelado' } });
    if (overlappingAppointment) {
      return next(new HttpError('El doctor no está disponible en esa fecha y hora', 400));
    }

    const startOfDay = new Date(appointmentDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(appointmentDate);
    endOfDay.setHours(23, 59, 59, 999);

    const appointmentsCount = await Appointment.countDocuments({
      doctor,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: 'cancelado' }
    });

    if (appointmentsCount >= 3) {
      return next(new HttpError('El doctor ya tiene el máximo de turnos asignados para ese día', 400));
    }

    const newAppointment = new Appointment({
      patient,
      doctor,
      date: appointmentDate,
      reason
    });

    const savedAppointment = await newAppointment.save();
    res.status(201).json(savedAppointment);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};

const listAppointments = async (req, res, next) => {
  const { patient, doctor } = req.query;

  try {

    if (patient && !mongoose.Types.ObjectId.isValid(patient)) {
      return next(new HttpError('ID de paciente inválido', 400));
    }

    if (doctor && !mongoose.Types.ObjectId.isValid(doctor)) {
      return next(new HttpError('ID de doctor inválido', 400));
    }

    const filter = {};

    if (req.query.patient) {
      filter.patient = patient
    }
    if (req.query.doctor) {
      filter.doctor = doctor
    }

    paginatedResponse(req, res, Appointment, filter)
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

  try {
    validateDoctorInput(req.body)
    if (!Object.values(APPOINTMENT_STATUS).includes(status)) {
      return next(new HttpError('Estado inválido', 400));
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('patient').populate('doctor');

    if (!updatedAppointment) {
      return next(new HttpError('Turno no encontrado', 404));
    }
    if (status === APPOINTMENT_STATUS.CONFIRMED) {
      await sendEmail({
        email: updatedAppointment.patient.email,
        subject: 'Confirmacion de turno',
        html: appointmentReminderEmail(updatedAppointment.patient.firstName, updatedAppointment.date, updatedAppointment.doctor.firstName)
      });
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
