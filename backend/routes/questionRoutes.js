// routes/questionRoutes.js
const express = require('express');
const router = express.Router();
const OpenAI = require("openai");
const Question = require('../models/Question');
const { verifyToken } = require('../middleware/authMiddleware'); 
const User = require('../models/User'); // asumimos que definimos el middleware en otro archivo
const Answer = require('../models/Answer'); // asumimos que definimos el middleware en otro archivo

// Configurar OpenAI API

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * GET /generate-question
 * Genera y guarda una pregunta tipo test de medicina.
 */
router.get('/generate-question', verifyToken, async (req, res) => {
  try {
    // Prompt que fuerza un formato de 6 líneas numeradas
    const prompt =
      "Por favor, genera una pregunta de medicina tipo test con cuatro opciones (A, B, C, D). " +
      "Devuélvela exactamente en este formato de 6 líneas:\n" +
      "1) Pregunta: <texto>\n" +
      "2) A) <opción A>\n" +
      "3) B) <opción B>\n" +
      "4) C) <opción C>\n" +
      "5) D) <opción D>\n" +
      "6) Respuesta correcta: <A|B|C|D>\n\n" +
      "Ejemplo:\n" +
      "1) Pregunta: ¿Cuál es el hueso más largo del cuerpo humano?\n" +
      "2) A) Húmero\n" +
      "3) B) Fémur\n" +
      "4) C) Tibia\n" +
      "5) D) Peroné\n" +
      "6) Respuesta correcta: B";

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

  
    const content = response.choices[0].message.content;
  

    // 1) Separa por líneas, quita vacíos
    const lines = content
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l !== "");


    if (lines.length !== 6) {
      console.error("❌ Formato inesperado, esperaba 6 líneas:", lines);
      return res.status(500).json({ error: 'Formato de pregunta inválido (líneas)' });
    }

    // 2) Elimina el prefijo numerado antes de “Pregunta:”
    const questionText = lines[0].replace(/^\d+\)\s*Pregunta:\s*/, "");

    // 3) Elimina el prefijo numerado y la letra de opción
    const options = {
      A: lines[1].replace(/^\d+\)\s*A\)\s*/, ""),
      B: lines[2].replace(/^\d+\)\s*B\)\s*/, ""),
      C: lines[3].replace(/^\d+\)\s*C\)\s*/, ""),
      D: lines[4].replace(/^\d+\)\s*D\)\s*/, "")
    };

    // 4) Elimina el prefijo numerado antes de “Respuesta correcta:”
    const correctOption = lines[5].replace(/^\d+\)\s*Respuesta correcta:\s*/, "");

  

    if (!['A','B','C','D'].includes(correctOption)) {
      console.error("❌ Respuesta correcta inválida:", correctOption);
      return res.status(500).json({ error: 'Respuesta correcta no reconocida' });
    }

    // 5) Guarda en MongoDB
    const questionDoc = new Question({
      question: questionText,
      options,
      correctAnswer: correctOption,
      createdBy: req.user.userId
    });
    await questionDoc.save();

    // 6) Devuelve la pregunta sin revelar la respuesta correcta
    res.json({
      questionId: questionDoc._id,
      pregunta: questionText,
      opciones: options,
      correctAnswer: questionDoc.correctAnswer
    });
  } catch (err) {
    console.error("💥 Error al generar la pregunta:", err);
    res.status(500).json({ error: 'Error al generar la pregunta' });
  }
});



  

// Endpoint: Enviar respuesta del usuario y obtener resultado
// Endpoint: Enviar respuesta del usuario y obtener resultado
router.post('/submit-answer', verifyToken, async (req, res) => {
  try {
    const { questionId, answer } = req.body;  // 'answer' es la opción elegida por el usuario, e.g., "B"
    // Recuperar la pregunta de la base de datos
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }
    // Verificar la respuesta
    const isCorrect = (answer === question.correctAnswer);
    // Actualizar la puntuación del usuario (+10 si acierta, -5 si falla)
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const puntosGanados = isCorrect ? 10 : -5;
    user.score += puntosGanados;
    await user.save();
    // Registrar la respuesta (opcional, en la colección Answer)
    await Answer.create({
      user: req.user.userId,
      question: question._id,
      chosenAnswer: answer,
      correct: isCorrect
    });
    // Devolver el resultado al cliente
    res.json({
      correcta: isCorrect,
      puntosGanados
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar la respuesta' });
  }
});

module.exports = router;
