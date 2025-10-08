const express = require("express");
const { register } = require("../controllers/usuarioController");
const router = express.Router();

router.post("/register", register);

module.exports = router;