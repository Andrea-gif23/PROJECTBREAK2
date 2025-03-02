const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Para encriptar la contraseña

// Definimos el esquema del usuario
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true, // El nombre de usuario debe ser único
  },
  password: {
    type: String,
    required: true,
  }
});

// Antes de guardar un usuario, encriptamos la contraseña
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para verificar la contraseña
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
