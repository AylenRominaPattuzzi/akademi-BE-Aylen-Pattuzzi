const express = require('express');
const { check } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  protect,
  restrictTo('admin', 'recepcion'),
  [
    check('patient').notEmpty().withMessage('El paciente es obligatorio'),
    check('doctor').notEmpty().withMessage('El doctor es obligatorio'),
    check('date').notEmpty().withMessage('La fecha es obligatoria')
  ],
  appointmentController.createAppointment
);

router.get('/', protect, restrictTo('admin', 'recepcion'), appointmentController.listAppointments);
router.get('/:id', protect, restrictTo('admin', 'recepcion'), appointmentController.getAppointmentById);

router.put(
  '/:id/status',
  protect,
  restrictTo('admin', 'recepcion'),
  [
    check('status').notEmpty().withMessage('El estado es obligatorio')
      .isIn(['confirmado', 'cancelado']).withMessage('El estado debe ser "confirmado" o "cancelado"')
  ],
  appointmentController.updateAppointmentStatus
);

module.exports = router;
