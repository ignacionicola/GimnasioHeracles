const express = require("express");
const router = express.Router();
const { getReporte, validarReporte } = require("../controllers/reportesController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/reporte", /* #swagger.tags=['Reportes'] */ authMiddleware, validarReporte, getReporte);

module.exports = router;
