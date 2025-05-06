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
      .isISO8601()
      .withMessage('La fecha debe estar en formato ISO (YYYY-MM-DDTHH:mm:ss)')
  ],
  appointmentController.createAppointment
);
router.get('/', appointmentController.listAppointments);
router.get('/:id', appointmentController.getAppointmentById);

//TODO: agregar el put


module.exports = router;
