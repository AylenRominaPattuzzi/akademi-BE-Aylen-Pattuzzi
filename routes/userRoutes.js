const express = require('express');
const { check } = require('express-validator');
const userController = require('../controllers/userController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  protect,
  restrictTo('admin'),
  [
    check('name').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').isEmail().withMessage('Debe ser un email válido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    check('role').isIn(['admin', 'recepcion']).withMessage('El rol debe ser admin o recepcion')
  ],
  userController.registerUser
);


router.get(
  '/',
  protect,
  restrictTo('admin'),
  userController.listUsers
);


router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  [
    check('name').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    check('email').optional().isEmail().withMessage('Debe ser un email válido'),
    check('password').optional().isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    check('role').optional().isIn(['admin', 'recepcion']).withMessage('Rol inválido')
  ],
  userController.updateUser
);


router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
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
    check('password').isLength({ min: 6 }).withMessage('La nueva contraseña debe tener al menos 6 caracteres')
  ],
  userController.resetPassword
);

module.exports = router;
