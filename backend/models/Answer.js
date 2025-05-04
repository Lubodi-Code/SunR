// models/Answer.js
const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
  chosenAnswer: String,    // La opción que eligió el usuario (ej: "B")
  correct: Boolean,        // Si la respuesta fue correcta o no
  answeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Answer', AnswerSchema);
