// server.js
require('dotenv').config();                 // Cargar variables de entorno de .env
const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware globales
app.use(express.json()); // parsear JSON en bodies de requests

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const rankingRoutes = require('./routes/rankingRoutes');

// Usar las rutas
app.use('/api', authRoutes);        // prefijo '/api' (opcional, puede ser '' si se desea)
app.use('/api', questionRoutes);
app.use('/api', rankingRoutes);

// Ruta base de prueba
app.get('/', (req, res) => {
  res.send('API de Quiz Médico en funcionamiento');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});
