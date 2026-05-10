const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const verificarAdmin = require("../middlewares/rolesMiddleware"); // Middleware para verificar rol de administrador
const {
  register,
  createSystemUser,
  getUsuarios,
  validarUsuarioNuevo,
  validarSocio,
  actualizarEstadoUsuario,
  getUsuariosActivos,
  getSociosConCuota,
  validarActualizarEstado,
} = require("../controllers/usuarioController");
const { login, logout } = require("../controllers/authController");
const router = express.Router();

//PUBLICAS
// POST - Login / Logout (unificados)
router.post("/login", /* #swagger.tags=['Usuarios'] */ login);
router.post("/logout", /* #swagger.tags=['Usuarios'] */ logout);

//Reguieren estar logueados
// GET - Obtener todos los usuarios
router.get(
  "/socios" /* #swagger.tags=['Usuarios'] */,
  authMiddleware,
  getUsuarios,
);

router.get(
  "/socios/cuota",
  /* #swagger.tags=['Usuarios'] */
  /* #swagger.description = 'Obtiene la última cuota pagada por cada socio, incluyendo información del socio.' */
  authMiddleware,
  getSociosConCuota,
);

// GET - Obtener usuarios activos
router.get(
  "/socios/activos",
  /* #swagger.tags=['Usuarios'] */ authMiddleware,
  getUsuariosActivos,
);
// POST - Registrar socio (cliente)

router.post(
  "/register",
  /* #swagger.tags=['Usuarios'] */ authMiddleware,
  validarSocio,
  register,
);

// POST - Registrar usuario del sistema (admin / recepcionista)
router.post(
  "/system/register",
  /* #swagger.tags=['Usuarios'] */
  /* #swagger.description='Registrar usuario del sistema (admin / recepcionista)' */
  authMiddleware,
  verificarAdmin,
  validarUsuarioNuevo,
  createSystemUser,
);

// PUT - Actualizar datos de usuario
router.put(
  "/:id",
  /* #swagger.tags=['Usuarios'] */
  /* #swagger.description='Actualizar estado del usuario a activo o inactivo, buscandolo por su ID' */
  authMiddleware,
  verificarAdmin,
  validarActualizarEstado,
  actualizarEstadoUsuario,
);
module.exports = router;
