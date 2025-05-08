const express = require('express');
const { check } = require('express-validator');
const patientController = require('../controllers/patientController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  protect,
  restrictTo('admin', 'recepcion'),
  [
    check('firstName').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('lastName').not().isEmpty().withMessage('El apellido es obligatorio'),
    check('dni').not().isEmpty().withMessage('El DNI es obligatorio').isNumeric().withMessage('El DNI debe ser numérico'),
    check('email').optional().isEmail().withMessage('Email inválido'),
    check('phone').optional().isMobilePhone('es-AR').withMessage('Teléfono inválido'),
    check('medicalCoverage').optional().isString()
  ],
  patientController.createPatient
);

router.get('/', protect, restrictTo('admin', 'recepcion'), patientController.listPatients);
router.get('/:id', protect, restrictTo('admin', 'recepcion'), patientController.getPatientById);

router.put(
  '/:id',
  protect,
  restrictTo('admin', 'recepcion'),
  [
    check('firstName').optional().not().isEmpty().withMessage('El nombre no puede estar vacío'),
    check('lastName').optional().not().isEmpty().withMessage('El apellido no puede estar vacío'),
    check('dni').optional().isNumeric().withMessage('El DNI debe ser numérico'),
    check('email').optional().isEmail().withMessage('Email inválido'),
    check('phone').optional().isMobilePhone('es-AR').withMessage('Teléfono inválido'),
    check('medicalCoverage').optional().isString()
  ],
  patientController.updatePatient
);

router.delete('/:id', protect, restrictTo('admin', 'recepcion'), patientController.deletePatient);

module.exports = router;