require('dotenv').config();               // Cargar .env
const express = require('express');
const cors = require('cors');             // Importar cors
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const rankingRoutes = require('./routes/rankingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 1) Middlewares globales
app.use(express.json());

// 2) Configurar CORS
app.use(cors({
  origin: 'http://localhost:5173',        // tu frontend en dev
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// 3) Conectar a MongoDB y montar rutas
connectDB()
  .then(() => {
    // Prefijo /api para todas las rutas
    app.use('/api/auth', authRoutes);
    app.use('/api', questionRoutes);   // generate-question, submit-answer, score
    app.use('/api', rankingRoutes);    // /api/ranking

    // Ruta base de prueba
    app.get('/', (req, res) => {
      res.send('API de Quiz Médico en funcionamiento');
    });

    // 4) Levantar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor arrancado en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ No se pudo iniciar la app por fallo en DB, saliendo...', err);
    process.exit(1);
  });
