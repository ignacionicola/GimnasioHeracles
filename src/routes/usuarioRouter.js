const express = require("express");
const {
  register,
  createSystemUser,
  getUsuarios,
  validarUsuarioNuevo,
  validarSocio,
  actualizarEstadoUsuario,
  getUsuariosActivos
} = require("../controllers/usuarioController");
const { login, logout } = require("../controllers/authController");
const router = express.Router();

// GET - Obtener todos los usuarios

router.get("/socios",/* #swagger.tags=['Usuarios'] */ getUsuarios);

// GET - Obtener usuarios activos
router.get("/socios/activos",/* #swagger.tags=['Usuarios'] */ getUsuariosActivos);
// POST - Registrar socio (cliente)

router.post("/register",/* #swagger.tags=['Usuarios'] */ validarSocio, register);

// POST - Login / Logout (unificados)
router.post("/login",/* #swagger.tags=['Usuarios'] */ login); 
router.post("/logout",/* #swagger.tags=['Usuarios'] */ logout);

// POST - Registrar usuario del sistema (admin / recepcionista)
router.post("/system/register",
  /* #swagger.tags=['Usuarios'] */
  /* #swagger.description='Registrar usuario del sistema (admin / recepcionista)' */
  validarUsuarioNuevo, createSystemUser);

// PUT - Actualizar datos de usuario
router.put("/:id",
  /* #swagger.tags=['Usuarios'] */ 
  /* #swagger.description='Actualizar estado del usuario a activo o inactivo, buscandolo por su ID' */
  actualizarEstadoUsuario);
module.exports = router;
