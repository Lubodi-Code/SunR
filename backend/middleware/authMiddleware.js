// Definir middleware de autenticación JWT (por ejemplo, en routes/questionRoutes.js o archivo separado)
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];      // Formato esperado: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Acceso no autorizado, falta token' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // attach payload (e.g., userId, username) to request
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token inválido o expirado' });
  }
}
module.exports = { verifyToken };