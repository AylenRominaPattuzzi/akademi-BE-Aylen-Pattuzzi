const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');
const { USER_ROLES } = require('../models/User'); 

const router = express.Router();

router.post(
  '/register',
  protect,
  restrictTo(USER_ROLES.ADMIN),
  [
    check('name').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').isEmail().withMessage('Debe ser un email válido'),
    check('password').isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres'),
    check('role').isIn(Object.values(USER_ROLES)).withMessage('El rol debe ser válido')
  ],
  userController.registerUser
);

router.get(
  '/',
  protect,
  restrictTo(USER_ROLES.ADMIN),
  userController.listUsers
);

router.get(
  '/:id',
  protect,
  restrictTo(USER_ROLES.ADMIN),
  userController.getUserById
);

router.put(
  '/:id',
  protect,
  restrictTo(USER_ROLES.ADMIN),
  [
    check('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    check('email').optional().isEmail().withMessage('Debe ser un email válido'),
    check('role').optional().isIn(Object.values(USER_ROLES)).withMessage('Rol inválido')
  ],
  userController.updateUser
);

router.delete(
  '/:id',
  protect,
  restrictTo(USER_ROLES.ADMIN),
  userController.deleteUser
);

router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Email inválido'),
    check('password').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  userController.loginUser
);

router.post(
  '/recover',
  [
    check('email').isEmail().withMessage('Email inválido')
  ],
  userController.recoverPassword
);

router.post(
  '/reset/:token',
  [
    check('password').isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres')
  ],
  userController.resetPassword
);

module.exports = router;
