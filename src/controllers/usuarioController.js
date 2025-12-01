const Usuario = require("../models/usuario");
const UsuarioSistema = require("../models/UsuarioSistema");
const { generarSalt, hashPassword } = require("../service/hashService");

// GET - Obtener todos los usuarios
async function getUsuarios(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] }
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
}

// POST - Registrar socio (cliente)
async function register(req, res) {
  console.log("BODY:", req.body);
  const { dni, nombre, apellido, email, telefono, puntos, plan } = req.body;
  try {
    const usuario = await Usuario.create({ dni, nombre, apellido, email, telefono, puntos, plan });
    res.status(201).json({ message: "Usuario registrado", user: usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// POST - Crear usuario del sistema (administrador / recepcionista)
async function createSystemUser(req, res) {
  const { nombreUsuario, contrasenia, correoUsuario, telefonoUsuario, rol } = req.body;
  try {
    const salt = generarSalt();
    const hash = hashPassword(contrasenia, salt);
    const usuario = await UsuarioSistema.create({
      nombreUsuario,
      contrasenia: hash,
      correoUsuario,
      telefonoUsuario,
      salt,
      rol: rol || "recepcionista"
    });
    res.status(201).json({ message: "Usuario del sistema creado", user: usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { register, createSystemUser, getUsuarios };

