const {User} = require('../models/User');
const HttpError = require('../utils/http-error');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const { paginatedResponse } = require('../utils/paginate');
const { recoverPasswordEmail } = require('../utils/emails/recoverPasswordEmail');


const registerUser = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return next(new HttpError('El email ya está registrado', 400));
    }

    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const listUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) {
      filter.role = req.query.role;
    }

    paginatedResponse(req, res, User, filter)
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(new HttpError('Usuario no encontrado', 404));
    }
    res.json(user);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const updateUser = async (req, res, next) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!updatedUser) {
      return next(new HttpError('Usuario no encontrado', 404));
    }

    res.json(updatedUser);
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return next(new HttpError('Usuario no encontrado', 404));
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+password');;
    if (!user) {
      return next(new HttpError('Usuario no encontrado', 401));
    }

    const isValid = await user.comparePassword(password);
    if (!isValid) {
      return next(new HttpError('Contraseña incorrecta', 401));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (error) {
    next(new HttpError(error.message, 500));
  }
};


const recoverPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(new HttpError('Usuario no encontrado', 404));
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7h' });
    const link = `http://localhost:3000/api/user/reset/${token}`;

    await sendEmail({
      email: user.email,
      subject: 'Recuperación de contraseña',
      html: recoverPasswordEmail(user.name, link)
    });

    res.json({ message: 'Enlace de recuperación enviado' });
  } catch (error) {
    next(new HttpError('Error al enviar el correo electrónico', 500));
  }
};


const resetPassword = async (req, res, next) => {
  try {
    const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('+password');;

    if (!user) {
      return next(new HttpError('Usuario no encontrado', 404));
    }

    user.password = req.body.password
    await user.save();

    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    next(new HttpError('Token inválido o expirado', 400));
  }
};

exports.registerUser = registerUser;
exports.listUsers = listUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
exports.loginUser = loginUser;
exports.recoverPassword = recoverPassword;
exports.resetPassword = resetPassword;
