const express = require("express");
const router = express.Router();
const {UsuarioController,validarUsuarioNuevo} = require("../controllers/usuarioController");

router.post("/register", validarUsuarioNuevo, UsuarioController.create);


module.exports = router;
