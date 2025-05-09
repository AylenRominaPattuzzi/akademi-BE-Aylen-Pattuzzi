const express = require('express');
const { check } = require('express-validator');
const doctorController = require('../controllers/doctorController');
const { protect, restrictTo } = require('../middleware/auth');
const { USER_ROLES } = require('../models/User'); 

const router = express.Router();

router.post(
  '/',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  [
    check('firstName').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('lastName').not().isEmpty().withMessage('El apellido es obligatorio'),
    check('email').normalizeEmail().isEmail().withMessage('Email inválido'),
    check('specialty').not().isEmpty().withMessage('La especialidad es obligatoria')
  ],
  doctorController.createDoctor
);

router.get(
  '/',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  doctorController.listDoctors
);

router.get(
  '/:id',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  doctorController.getDoctorById
);

router.put(
  '/:id',
  protect,
  restrictTo(USER_ROLES.ADMIN, USER_ROLES.RECEPCION),
  [
    check('firstName').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('email').normalizeEmail().isEmail().withMessage('Email inválido'),
    check('specialty').not().isEmpty().withMessage('La especialidad es obligatoria')
  ],
  doctorController.updateDoctor
);

module.exports = router;
