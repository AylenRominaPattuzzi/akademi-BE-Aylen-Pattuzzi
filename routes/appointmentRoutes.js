const express = require('express');
const { check } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/auth');
const { USER_ROLES } = require('../models/User');
const { APPOINTMENT_STATUS } = require('../models/Appointment');

const router = express.Router();

router.post(
  '/',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  [
    check('patient').notEmpty().withMessage('El paciente es obligatorio'),
    check('doctor').notEmpty().withMessage('El doctor es obligatorio'),
    check('date').notEmpty().withMessage('La fecha es obligatoria')
  ],
  appointmentController.createAppointment
);

router.get(
  '/',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  appointmentController.listAppointments
);

router.get(
  '/:id',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  appointmentController.getAppointmentById
);

router.put(
  '/:id/status',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  [
    check('status')
      .notEmpty().withMessage('El estado es obligatorio')
      .isIn(Object.values(APPOINTMENT_STATUS).filter(status => status !== APPOINTMENT_STATUS.PENDING))
      .withMessage(`El estado debe ser uno de: ${Object.values(APPOINTMENT_STATUS).filter(status => status !== APPOINTMENT_STATUS.PENDING).join(', ')}`)
  ],
  appointmentController.updateAppointmentStatus
);

module.exports = router;
