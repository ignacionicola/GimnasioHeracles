const express = require("express");
const { login, logout } = require("../controllers/authController");
const router = express.Router();

router.post("/login",/* #swagger.tags=['Authentication'] */ login);
router.post("/logout", /* #swagger.tags=['Authentication'] */ logout);

module.exports = router;