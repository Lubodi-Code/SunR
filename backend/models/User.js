// models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },         // Se almacenará en formato hash (bcrypt)
  score:    { type: Number, default: 0 }              // Puntuación inicial 0
});

module.exports = mongoose.model('User', UserSchema);
