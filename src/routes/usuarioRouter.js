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

// #swagger.path = '/api/usuarios/socios'
router.get("/socios",/* #swagger.tags=['Usuarios'] */ getUsuarios);

// POST - Registrar socio (cliente)

router.post("/register",/* #swagger.tags=['Usuarios'] */ validarSocio, register);

// POST - Login / Logout (unificados)
router.post("/login",/* #swagger.tags=['Usuarios'] */ login); 
router.post("/logout",/* #swagger.tags=['Usuarios'] */ logout);

// POST - Registrar usuario del sistema (admin / recepcionista)
router.post("/system/register",/* #swagger.tags=['Usuarios'] */ validarUsuarioNuevo, createSystemUser);

module.exports = router;
