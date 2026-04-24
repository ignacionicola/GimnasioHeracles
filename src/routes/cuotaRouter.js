const express = require("express");
const router = express.Router();
const {
  obtenerUltimaCuotaPorSocio,
  actualizarEstadoCuota,
  obtenerCuotasPorSocio,
  renovarCuota
} = require("../controllers/cuotasController");

// POST - Crear nueva cuota
router.post("/renovar",/* #swagger.tags=['Cuotas'] */ renovarCuota);

// PUT - Actualizar el estado de una cuota
router.put("/:idCuota/estado", /* #swagger.tags=['Cuotas'] */ actualizarEstadoCuota);

router.get("/:idSocio", /* #swagger.tags=['Cuotas'] */ obtenerCuotasPorSocio);
module.exports = router;
