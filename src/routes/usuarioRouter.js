const express = require("express");
const { register, createSystemUser, getUsuarios } = require("../controllers/usuarioController");
const { login, logout } = require("../controllers/authController");
const router = express.Router();

// GET - Obtener todos los usuarios
router.get("/", getUsuarios);

// POST - Registrar socio (cliente)
router.post("/register", register);

// POST - Login / Logout (unificados)
router.post("/login", login);
router.post("/logout", logout);

// POST - Registrar usuario del sistema (admin / recepcionista)
router.post("/system/register", createSystemUser);

module.exports = router;