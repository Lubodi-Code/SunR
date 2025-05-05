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


// 1️⃣ Armar la whitelist con EXACTAMENTE tu dominio de Front
const whitelist = [
  process.env.URL_FRONTEND,     
       // e.g. 'https://sunrfrontend.vercel.app'        // para tu dev local
]

// 2️⃣ Opciones de CORS que cubran todas las rutas y el preflight
const corsOptions = {
  origin: (origin, callback) => {
    // permitir si no viene origin (Postman, server2server) o si está en la whitelist
    if (!origin || whitelist.includes(origin)) {
      return callback(null, true)
    }
    callback(new Error('Not allowed by CORS'))
  },
  credentials: true
}

// 3️⃣ Aplica CORS a todas las peticiones…
app.use(cors(corsOptions))


// 4️⃣ (Opcional) Atrapa el favicon para que no devuelva 404
app.get('/favicon.ico', (req, res) => res.status(204).end())


// 3) Conectar a MongoDB y montar rutas
connectDB()
  .then(() => {
    // Prefijo /api para todas las rutas
    app.use('/api', authRoutes);
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
