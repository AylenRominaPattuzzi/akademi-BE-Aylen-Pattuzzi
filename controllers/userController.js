const User = require('../models/User');
const HttpError = require('../utils/http-error');

const registerUser = async (req, res, next) => {
    const { name, email, password, role } = req.body;
  
    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return next(new HttpError('El email ya está registrado', 400));
      }
  
      const hashedPassword = await bcrypt.hash(password, 12);
      const newUser = new User({ name, email, password: hashedPassword, role });
      const savedUser = await newUser.save();
  
      res.status(201).json(savedUser);
    } catch (error) {
      next(new HttpError(error.message, 500));
    }
  };

  const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user || !user.active) {
        return next(new HttpError('Usuario no encontrado o inactivo', 401));
      }
  
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return next(new HttpError('Contraseña incorrecta', 401));
      }
  
      const token = generateToken(user._id);
      res.json({ token, role: user.role });
    } catch (error) {
      next(new HttpError(error.message, 500));
    }
  };

exports.registerUser = registerUser;
exports.loginUser = loginUser;