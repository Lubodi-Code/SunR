// controllers/questionController.js
const OpenAI = require("openai");
const Question = require('../models/Question');
const User = require('../models/User');
const Answer = require('../models/Answer');

// Configurar OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Genera y guarda una pregunta tipo test de medicina.
 */
exports.generateQuestion = async (req, res) => {
  try {
    const prompt =
  "Crea una pregunta de medicina tipo test (fácil o difícil), con 4 opciones (A-D) y una respuesta correcta. Devuélvela en este formato exacto:\n" +
  "1) Pregunta: <texto>\n" +
  "2) A) <opción A>\n" +
  "3) B) <opción B>\n" +
  "4) C) <opción C>\n" +
  "5) D) <opción D>\n" +
  "6) Respuesta: <A|B|C|D>\n\n" +
  "Ejemplo:\n" +
  "1) Pregunta: ¿Cuál es el hueso más largo del cuerpo humano?\n" +
  "2) A) Húmero\n" +
  "3) B) Fémur\n" +
  "4) C) Tibia\n" +
  "5) D) Peroné\n" +
  "6) Respuesta: B";


    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }]
    });

    const content = response.choices[0].message.content;

    // Procesar líneas
    const lines = content
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(l => l !== "");

    if (lines.length !== 6) {
      console.error("❌ Formato inesperado, esperaba 6 líneas:", lines);
      return res.status(500).json({ error: 'Formato de pregunta inválido (líneas)' });
    }

    const questionText = lines[0].replace(/^\d+\)\s*Pregunta:\s*/, "");
    const options = {
      A: lines[1].replace(/^\d+\)\s*A\)\s*/, ""),
      B: lines[2].replace(/^\d+\)\s*B\)\s*/, ""),
      C: lines[3].replace(/^\d+\)\s*C\)\s*/, ""),
      D: lines[4].replace(/^\d+\)\s*D\)\s*/, "")
    };
    const correctOption = lines[5].replace(/^\d+\)\s*Respuesta correcta:\s*/, "");

    if (!['A','B','C','D'].includes(correctOption)) {
      console.error("❌ Respuesta correcta inválida:", correctOption);
      return res.status(500).json({ error: 'Respuesta correcta no reconocida' });
    }

    const questionDoc = new Question({
      question: questionText,
      options,
      correctAnswer: correctOption,
      createdBy: req.user.userId
    });
    await questionDoc.save();

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
};

/**
 * Recibe respuesta del usuario, verifica, actualiza puntuación y guarda respuesta.
 */
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, answer } = req.body;
    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ error: 'Pregunta no encontrada' });

    const isCorrect = (answer === question.correctAnswer);
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });

    const puntosGanados = isCorrect ? 10 : -5;
    user.score += puntosGanados;
    await user.save();

    await Answer.create({
      user: req.user.userId,
      question: question._id,
      chosenAnswer: answer,
      correct: isCorrect
    });

    res.json({ correcta: isCorrect, puntosGanados });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar la respuesta' });
  }
};


