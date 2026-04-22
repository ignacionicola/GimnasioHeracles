const Usuario = require("../models/usuario");
const UsuarioSistema = require("../models/UsuarioSistema");
const { generarSalt, hashPassword } = require("../service/hashService");
const { body, validationResult } = require("express-validator");
const Cuota = require("../models/cuota");
const Plan = require("../models/Plan");
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

// GET - Obtener usuarios activos
async function getUsuariosActivos(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      where: { activo: true },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios activos" });
  }
}

//PUT - Actualizar estado del usuario (activo/inactivo)
async function actualizarEstadoUsuario(req, res) {
  const { id } = req.params;
  const { activo } = req.body;
  try {    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    await usuario.update({ activo });
    res.json({ message: "Estado del usuario actualizado", user: usuario });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar estado del usuario" });
  }
}


// POST - Registrar socio (cliente)
async function register(req, res,next) {
  console.log("BODY:", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error("Datos invalidos", 400, errors.array());
  }
  const { dni, nombre, apellido, email, telefono, puntos,metodoPago, idPlan } = req.body;
  try {
  const plan= await Plan.findByPk(idPlan);
  if (!plan) {
    return res.error("Plan no encontrado", 404);
  }
    const usuario = await Usuario.create({
      dni,
      nombre,
      apellido,
      email,
      telefono,
      puntos,
      plan: plan.nombrePlan,
    });
    const cuota=await Cuota.create({ idSocio: usuario.dni,metodoPago, monto: plan.precio, nombrePlan: plan.nombrePlan });
    res.status(201).json({ message: "Usuario registrado", user: usuario });
  } catch (error) {
    next(error);
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

const validarSocio = [
  body("dni").notEmpty().withMessage("El DNI es requerido").trim(),
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isString(),
  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("Apellido requerido")
    .isString(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail(),
  body("telefono").trim().notEmpty().withMessage("El telefono es requerido"),
];
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
  validarSocio,
  actualizarEstadoUsuario,
  getUsuariosActivos
};
