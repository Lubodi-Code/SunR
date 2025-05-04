// models/Question.js
const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  question: String, 
  options: {                       // Opciones de múltiple choice
    A: String,
    B: String,
    C: String,
    D: String
  },
  correctAnswer: String,           // La letra de la opción correcta (e.g., "B")
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // usuario que pidió la pregunta (opcional)
});

module.exports = mongoose.model('Question', QuestionSchema);
