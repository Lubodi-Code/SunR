const mongoose = require('mongoose');

const connectDB = async () => {
  // 1) Listeners globales de Mongoose
  mongoose.connection.on('connecting', () => {
    console.log('🟡 MongoDB intentando conectar...');
  });
  mongoose.connection.on('connected', () => {
    console.log('🟢 MongoDB conectado (event)');
  });
  mongoose.connection.on('error', (err) => {
    console.error('🔴 MongoDB error (event):', err);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('🟠 MongoDB desconectado');
  });

  // 2) Intento de conexión
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // timeout rápido para fallos
    });
    console.log('✅ MongoDB conectado correctamente (await)');
  } catch (err) {
    console.error('❌ Error al conectar con MongoDB (await):', err);
    throw err; // para que tu app falle rápido y veas el log
  }
};

module.exports = connectDB;