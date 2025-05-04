// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registro de nuevo usuario
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Verificar si el username ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Nombre de usuario ya existe' });
    }
    // Hashear la contraseña antes de guardarla
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);
    // Crear y guardar el usuario
    const newUser = new User({ username, password: hashedPwd });
    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al registrar usuario', details: err.message });
  }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    // Buscar al usuario por nombre
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    // Comparar contraseña con el hash almacenado
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    // Generar token JWT con el id y nombre de usuario
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }  // Token válido por 2 horas (por ejemplo)
    );
    res.json({ message: 'Login exitoso', token });
  } catch (err) {
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
});

module.exports = router;
