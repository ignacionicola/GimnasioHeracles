const express = require("express");
const router = express.Router();
const {
  crearCuota,
  obtenerCuotas,
  actualizarEstadoCuota,
} = require("../controllers/cuotasController");

// POST - Crear nueva cuota
router.post("/",/* #swagger.tags=['Cuotas'] */ crearCuota);

// GET - Obtener todas las cuotas
router.get("/",/* #swagger.tags=['Cuotas'] */ obtenerCuotas);

// PUT - Actualizar estado de una cuota
router.put("/:idCuota/estado", /* #swagger.tags=['Cuotas'] */ actualizarEstadoCuota);

module.exports = router;
