const UsuarioSistema = require("../models/UsuarioSistema");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const {hashPassword} = require("../service/hashService");
require("dotenv").config();
const { body, validationResult } = require("express-validator");

const UsuarioController = {

  // ✅ Crear un nuevo usuario
  async create(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.error("Datos invalidos", 400, errors.array());
    }
    try {
      const { nombreUsuario, contrasenia, correoUsuario, telefonoUsuario } =
        req.body;

      // Verificar que no exista
      const existe = await UsuarioSistema.findOne({ where: { nombreUsuario } });
      if (existe) {
        return res
          .status(400)
          .json({ message: "El nombre de usuario ya existe" });
      }

      // Hashear contraseña
      const salt = crypto.randomBytes(16).toString("hex");
      const hash = hashPassword(contrasenia, salt);

      // Crear usuario
      const nuevoUsuario = await UsuarioSistema.create({
        nombreUsuario,
        rol: "admin",
        contrasenia: hash,
        correoUsuario,
        telefonoUsuario,
        salt: salt,
      });

      res.success(nuevoUsuario);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      res.status(500).json({ message: "Error al crear usuario" });
    }
  },

  
};

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

module.exports = { UsuarioController, validarUsuarioNuevo };
