const express = require('express');
const { check } = require('express-validator');
const doctorController = require('../controllers/doctorController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/',
  protect,
  restrictTo('admin', 'recepcion'),
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
  restrictTo('admin', 'recepcion'),
  doctorController.listDoctors
);

router.get(
  '/:id',
  protect,
  restrictTo('admin', 'recepcion'),
  doctorController.getDoctorById
);

router.put(
  '/:id',
  protect,
  restrictTo('admin', 'recepcion'),
  [
    check('firstName').not().isEmpty().withMessage('El nombre es obligatorio'),
    check('email').normalizeEmail().isEmail().withMessage('Email inválido'),
    check('specialty').not().isEmpty().withMessage('La especialidad es obligatoria')
  ],
  doctorController.updateDoctor
);

module.exports = router;
