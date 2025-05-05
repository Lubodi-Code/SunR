// controllers/rankingController.js
const User = require('../models/User');

/**
 * Obtiene el ranking de los 10 mejores usuarios.
 */
exports.getRanking = async (req, res) => {
  try {
    const users = await User
      .find({}, { password: 0 })   // excluir password
      .sort({ score: -1 })
      .limit(10);

    const ranking = users.map(u => ({
      username: u.username,
      score: u.score
    }));

    res.json(ranking);
  } catch (err) {
    console.error('Error al obtener el ranking:', err);
    res.status(500).json({ error: 'Error al obtener el ranking' });
  }
};

/**
 * Obtiene el score del usuario autenticado.
 */
exports.getScore = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId, 'username score');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ username: user.username, score: user.score });
  } catch (err) {
    console.error('Error al obtener el puntaje:', err);
    res.status(500).json({ error: 'Error al obtener el puntaje' });
  }
};
