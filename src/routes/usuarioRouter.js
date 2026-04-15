const express = require("express");
const {
  register,
  createSystemUser,
  getUsuarios,
  validarUsuarioNuevo,
  validarSocio,
} = require("../controllers/usuarioController");
const { login, logout } = require("../controllers/authController");
const router = express.Router();

// GET - Obtener todos los usuarios
/**
 *@swagger
 * /api/usuarios/socios:
 *   get:
 *    summary: Obtener todos los usuarios
 *    tags: [Usuarios]
 *    responses:
 *     200:
 *       description: Lista de usuarios
 * */
router.get("/socios", getUsuarios);

// POST - Registrar socio (cliente)
router.post("/register", validarSocio, register);

// POST - Login / Logout (unificados)
router.post("/login", login);
router.post("/logout", logout);

// POST - Registrar usuario del sistema (admin / recepcionista)
router.post("/system/register", validarUsuarioNuevo, createSystemUser);

module.exports = router;
