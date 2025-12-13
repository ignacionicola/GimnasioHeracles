const Usuario = require("../models/usuario");
const UsuarioSistema = require("../models/UsuarioSistema");
const { generarSalt, hashPassword } = require("../service/hashService");
const { body, validationResult } = require("express-validator");

// GET - Obtener todos los usuarios
async function getUsuarios(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
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
    const usuario = await Usuario.create({
      dni,
      nombre,
      apellido,
      email,
      telefono,
      puntos,
      plan,
    });
    res.status(201).json({ message: "Usuario registrado", user: usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// POST - Crear usuario del sistema (administrador / recepcionista)
async function createSystemUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error("Datos invalidos", 400, errors.array());
  }
  const { nombreUsuario, contrasenia, correoUsuario, telefonoUsuario, rol } =
    req.body;
  const existe = await UsuarioSistema.findOne({ where: { nombreUsuario } });
  if (existe) {
    return res.status(400).json({ message: "El nombre de usuario ya existe" });
  }
  try {
    const salt = generarSalt();
    const hash = hashPassword(contrasenia, salt);
    const usuario = await UsuarioSistema.create({
      nombreUsuario,
      contrasenia: hash,
      correoUsuario,
      telefonoUsuario,
      salt,
      rol: rol || "recepcionista",
    });
    res
      .status(201)
      .json({ message: "Usuario del sistema creado", user: usuario });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
const validarUsuarioNuevo = [
  body("nombreUsuario")
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 5, max: 15 })
    .withMessage("Minimo 5 caracteres y maximo 15 caracteres"),
  body("correoUsuario")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Recuerdo que un email tiene el formato algo@algo.algo"),
  body("contrasenia")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Minimo 6 caracteres"),
  body("telefonoUsuario")
    .trim()
    .notEmpty()
    .withMessage("El telefono es requerido"),
];
module.exports = {
  register,
  createSystemUser,
  getUsuarios,
  validarUsuarioNuevo,
};
