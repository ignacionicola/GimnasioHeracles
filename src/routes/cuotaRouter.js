const express = require("express");
const router = express.Router();
const {
  crearCuota,
  obtenerCuotas,
  actualizarEstadoCuota,
} = require("../controllers/cuotasController");

// POST - Crear nueva cuota
router.post("/", crearCuota);

// GET - Obtener todas las cuotas
router.get("/", obtenerCuotas);

// PUT - Actualizar estado de una cuota
router.put("/:idCuota/estado", actualizarEstadoCuota);

module.exports = router;
