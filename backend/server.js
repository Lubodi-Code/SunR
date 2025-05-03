require('dotenv').config(); // Cargar variables de entorno de .env

const express = require('express');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const rankingRoutes = require('./routes/rankingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware globales
app.use(express.json()); // parsear JSON en bodies de requests

// Conexión a MongoDB Atlas
connectDB()
  .then(() => {
    // Monta tus rutas solo si la base está lista
    app.use('/api', authRoutes);
    app.use('/api', questionRoutes);
    app.use('/api', rankingRoutes);

    // Ruta base de prueba
    app.get('/', (req, res) => {
      res.send('API de Quiz Médico en funcionamiento');
    });

    // Inicia servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor arrancado en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ No se pudo iniciar la app por fallo en DB, saliendo...', err);
    process.exit(1);
  });