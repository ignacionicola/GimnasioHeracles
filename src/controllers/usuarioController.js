const Usuario = require("../models/usuario");

async function register(req, res) {
  console.log("BODY:", req.body); 
  const { dni, nombre, apellido, email, telefono, puntos } = req.body;
  try {
    const usuario = await Usuario.create({ dni, nombre, apellido, email, telefono, puntos });
    res.status(201).json({ message: "Usuario registrado", user: usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { register };

