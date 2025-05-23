const express = require('express');
const { check } = require('express-validator');
const patientController = require('../controllers/patientController');
const { protect, restrictTo } = require('../middleware/auth');
const { USER_ROLES } = require('../models/User'); // Importar enum de roles

const router = express.Router();

router.post(
  '/',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  [
    check('firstName').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('lastName').not().isEmpty().withMessage('El apellido es obligatorio'),
    check('dni').not().isEmpty().withMessage('El DNI es obligatorio').isNumeric().withMessage('El DNI debe ser numérico'),
    check('email').optional().isEmail().withMessage('Email inválido'),
    check('medicalCoverage').optional().isString()
  ],
  patientController.createPatient
);

router.get(
  '/',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  patientController.listPatients
);

router.get(
  '/:id',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  patientController.getPatientById
);

router.put(
  '/:id',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  [
    check('firstName').optional().not().isEmpty().withMessage('El nombre no puede estar vacío'),
    check('lastName').optional().not().isEmpty().withMessage('El apellido no puede estar vacío'),
    check('dni').optional().isNumeric().withMessage('El DNI debe ser numérico'),
    check('email').optional().isEmail().withMessage('Email inválido'),
    check('medicalCoverage').optional().isString()
  ],
  patientController.updatePatient
);

router.delete(
  '/:id',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  patientController.deletePatient
);

module.exports = router;
