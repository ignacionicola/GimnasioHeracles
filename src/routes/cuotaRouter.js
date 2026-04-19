const express = require("express");
const router = express.Router();
const {
  crearCuota,
  obtenerUltimaCuotaPorSocio,
  actualizarEstadoCuota,
  obtenerCuotasPorSocio
} = require("../controllers/cuotasController");

// POST - Crear nueva cuota
router.post("/",/* #swagger.tags=['Cuotas'] */ crearCuota);

// GET - Obtener ultima cuota por socio
router.get("/",
  /* #swagger.tags=['Cuotas'] */ 
  /* #swagger.description = 'Obtiene la última cuota pagada por cada socio, incluyendo información del socio.' */
  obtenerUltimaCuotaPorSocio);

// PUT - Actualizar estado de una cuota
router.put("/:idCuota/estado", /* #swagger.tags=['Cuotas'] */ actualizarEstadoCuota);

router.get("/socio/:idSocio", /* #swagger.tags=['Cuotas'] */ obtenerCuotasPorSocio);
module.exports = router;
