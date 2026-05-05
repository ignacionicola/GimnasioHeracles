const express = require("express");
const router = express.Router();
const {
  obtenerUltimaCuotaPorSocio,
  actualizarEstadoCuota,
  obtenerCuotasPorSocio,
  renovarCuota,
  validarRenovacion,
} = require("../controllers/cuotasController");
// POST - Crear nueva cuota
router.post("/renovar",/* #swagger.tags=['Cuotas'] */ validarRenovacion,renovarCuota);

// PUT - Actualizar el estado de una cuota
router.put("/:idCuota/estado", /* #swagger.tags=['Cuotas'] */ actualizarEstadoCuota);

router.get("/:idSocio", /* #swagger.tags=['Cuotas'] */ obtenerCuotasPorSocio);
module.exports = router;
