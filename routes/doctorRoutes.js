const express = require('express');
const { check } = require('express-validator');
const doctorController = require('../controllers/doctorController');

const router = express.Router();

router.post(
    '/',
    [
        check('firstName')
            .not()
            .isEmpty()
            .withMessage('El nombre es obligatorio'),
        check('lastName')
            .not()
            .isEmpty()
            .withMessage('El apellido es obligatorio'),
        check('email')
            .normalizeEmail()
            .isEmail()
            .withMessage('Email inválido'),
        check('specialty')
            .not()
            .isEmpty()
            .withMessage('La especialidad es obligatoria')
    ],
    doctorController.createDoctor
);

router.get('/', doctorController.listDoctors);

router.get('/:id', doctorController.getDoctorById);

router.put(
    '/:id',
    [
        check('firstName')
            .not()
            .isEmpty()
            .withMessage('El nombre es obligatorio'),
        check('email')
            .normalizeEmail()
            .isEmail()
            .withMessage('Email inválido'),
        check('specialty')
            .not()
            .isEmpty()
            .withMessage('La especialidad es obligatoria')
    ],
    doctorController.updateDoctor
);

module.exports = router;
