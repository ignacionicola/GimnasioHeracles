const jwt = require("../service/jwtService");
const Usuario = require("../models/usuario");

async function login(req, res) {
  const { dni } = req.body;
  try {
    const usuario = await Usuario.findOne({ where: { dni } });
    if (!usuario) throw new Error("DNI inválido");
    const payload = { id: usuario.id, dni: usuario.dni, rol: usuario.rol };
    const token = jwt.generarToken(payload);
    res.cookie("cookie-token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 3600000,
    });
    res.json({ token, user: { id: usuario.id, dni: usuario.dni, nombre: usuario.nombre, rol: usuario.rol } });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = { login };