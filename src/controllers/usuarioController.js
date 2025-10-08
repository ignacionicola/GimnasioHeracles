const Usuario = require("../models/usuario");

async function register(req, res) {
  console.log("BODY:", req.body); 
  const { dni } = req.body;
  try {
    const usuario = await Usuario.create({ dni });
    res.status(201).json({ message: "Usuario registrado", user: { id: usuario.id, dni: usuario.dni } });
  } catch (error) {
  res.status(400).json({ error: error.message });
}
  
  /*catch (error) {
    res.status(400).json({ error: "No se pudo registrar el usuario" });
  } */
}

module.exports = { register };

