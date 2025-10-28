const Usuario = require("../models/usuario");
const UsuarioSistema = require("../models/UsuarioSistema");
const { generarSalt, hashPassword } = require("../service/hashService");

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

// Crear usuario del sistema (administrador / recepcionista) - usado por panel admin
async function createSystemUser(req, res) {
  try {
    const { nombreUsuario, contrasenia, correoUsuario, telefonoUsuario, rol } = req.body;

    // verificar existencia
    const existe = await UsuarioSistema.findOne({ where: { nombreUsuario } });
    if (existe) {
      return res.status(400).json({ message: "El nombre de usuario ya existe" });
    }

    const salt = generarSalt();
    const hash = hashPassword(contrasenia, salt);

    const nuevoUsuario = await UsuarioSistema.create({
      nombreUsuario,
      rol: rol || "admin",
      contrasenia: hash,
      correoUsuario,
      telefonoUsuario,
      salt,
    });

    return res.status(201).json({ success: true, user: nuevoUsuario });
  } catch (error) {
    console.error("Error al crear usuario del sistema:", error);
    return res.status(500).json({ message: "Error al crear usuario" });
  }
}

module.exports = { register, createSystemUser };

