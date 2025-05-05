// routes/rankingRoutes.js
const express = require('express');
const router = express.Router();
const { getRanking, getScore } = require('../controlers/rankingController');
const { verifyToken } = require('../middleware/authMiddleware');

// Obtener top 10 usuarios
router.get('/ranking', getRanking);

// Obtener score del usuario autenticado
router.get('/score', verifyToken, getScore);

module.exports = router;
