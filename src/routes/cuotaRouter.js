const express = require("express");
const router = express.Router();
const {
  crearCuota,
  obtenerCuotas,
  actualizarEstadoCuota,
  obtenerCuotasPorSocio
} = require("../controllers/cuotasController");

// POST - Crear nueva cuota
router.post("/",/* #swagger.tags=['Cuotas'] */ crearCuota);

// GET - Obtener todas las cuotas
router.get("/",/* #swagger.tags=['Cuotas'] */ obtenerCuotas);

// PUT - Actualizar estado de una cuota
router.put("/:idCuota/estado", /* #swagger.tags=['Cuotas'] */ actualizarEstadoCuota);

router.get("/socio/:idSocio", /* #swagger.tags=['Cuotas'] */ obtenerCuotasPorSocio);
module.exports = router;
