// routes/rankingRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware'); 
// Endpoint: Obtener ranking de usuarios por puntuación
router.get('/ranking', async (req, res) => {
  try {
    // Buscar todos los usuarios ordenados descendentemente por score
    const users = await User.find({}, { password: 0 })  // opcional: excluir el campo password
                            .sort({ score: -1 })
                            .limit(10);
    // Devolver una lista con nombre de usuario y puntuación
    const ranking = users.map(u => ({ username: u.username, score: u.score }));
    res.json(ranking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener el ranking' });
  }
});

router.get('/score', verifyToken, async (req, res) => {
    try {
      // 1. Recuperar al usuario según el ID que puso verifyToken en req.user
      const user = await User.findById(req.user.userId, 'score');
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      // 2. Devolver solo el campo score
      res.json({ score: user.score });
    } catch (err) {
      console.error('Error al obtener el score:', err);
      res.status(500).json({ error: 'Error al obtener el puntaje' });
    }
  });
module.exports = router;
