require('dotenv').config();               // Cargar .env
const fetch = require('node-fetch');      // <-- importa fetch
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const questionRoutes = require('./routes/questionRoutes');
const rankingRoutes = require('./routes/rankingRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 1) Middlewares globales
app.use(express.json());

// 1️⃣ Whitelist con tu dominio
const whitelist = [
  process.env.URL_FRONTEND,    // https://sunrfrontend.vercel.app
];

// 2️⃣ Opciones de CORS
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// 3️⃣ Aplica CORS
app.use(cors(corsOptions));

// 4️⃣ Evita 404 en /favicon.ico
app.get('/favicon.ico', (req, res) => res.status(204).end());

// 5️⃣ Endpoint para saber tu IP de salida
app.get('/ip', async (req, res) => {
  try {
    const ip = await fetch('https://api.ipify.org').then(r => r.text());
    console.log('📡 Mi IP de salida es:', ip);
    res.send(`IP: ${ip}`);
  } catch (e) {
    console.error('Error obteniendo IP:', e);
    res.status(500).send('Error interno + ' + e.message);
  }
});

// 6) Conectar a MongoDB y montar rutas
connectDB()
  .then(() => {
    app.use('/api', authRoutes);
    app.use('/api', questionRoutes);
    app.use('/api', rankingRoutes);

    app.get('/', (req, res) => {
      res.send('API de Quiz Médico en funcionamiento');
    });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor arrancado en puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ No se pudo iniciar la app por fallo en DB, saliendo...', err);
    process.exit(1);
  });
