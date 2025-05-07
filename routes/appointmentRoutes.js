const express = require('express');
const { check } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');

const router = express.Router();

router.post(
  '/',
  [
    check('patient')
      .notEmpty()
      .withMessage('El paciente es obligatorio'),
    check('doctor')
      .notEmpty()
      .withMessage('El doctor es obligatorio'),
    check('date')
      .notEmpty()
      .withMessage('La fecha es obligatoria')
  ],
  appointmentController.createAppointment
);

router.get('/', appointmentController.listAppointments);

router.get('/:id', appointmentController.getAppointmentById);

router.put(
  '/:id/status',
  [
    check('status')
      .notEmpty()
      .withMessage('El estado es obligatorio')
      .isIn(['confirmado', 'cancelado'])
      .withMessage('El estado debe ser "confirmado" o "cancelado"')
  ],
  appointmentController.updateAppointmentStatus
);

module.exports = router;
