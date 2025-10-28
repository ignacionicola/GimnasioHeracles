const express = require("express");
const { register, createSystemUser } = require("../controllers/usuarioController");
const { login, logout } = require("../controllers/authController");
const router = express.Router();

// Registrar socio (cliente)
router.post("/register", register);

// Login / Logout (unificados)
router.post("/login", login);
router.post("/logout", logout);

// Registrar usuario del sistema (admin / recepcionista)
router.post("/system/register", createSystemUser);

module.exports = router;