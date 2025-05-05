const express = require('express');
const router = express.Router();
const { generateQuestion, submitAnswer } = require('../controlers/questionController');
const { verifyToken } = require('../middleware/authMiddleware');

// Generar pregunta
router.get('/generate-question', verifyToken, generateQuestion);
// Enviar respuesta
router.post('/submit-answer', verifyToken, submitAnswer);

module.exports = router;