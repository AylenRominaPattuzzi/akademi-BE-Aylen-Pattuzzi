const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const USER_ROLES = {
  ADMIN: 'admin',
  RECEPCION: 'recepcion'
};

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.RECEPCION
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Exportar tanto el modelo como el enum
module.exports = {
  User: mongoose.model('User', userSchema),
  USER_ROLES
};
