const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const verificarAdmin = require("../middlewares/rolesMiddleware");
const {
  obtenerUltimaCuotaPorSocio,
  actualizarEstadoCuota,
  obtenerCuotasPorSocio,
  renovarCuota,
  validarRenovacion,
} = require("../controllers/cuotasController");
// POST - Crear nueva cuota
router.post(
  "/renovar" /* #swagger.tags=['Cuotas'] */,
  authMiddleware,
  validarRenovacion,
  renovarCuota,
);

// PUT - Actualizar el estado de una cuota
router.put(
  "/:idCuota/estado",
  /* #swagger.tags=['Cuotas'] */
  authMiddleware,
  verificarAdmin,
  actualizarEstadoCuota,
);

router.get(
  "/:idSocio" /* #swagger.tags=['Cuotas'] */,
  authMiddleware,
  obtenerCuotasPorSocio,
);
module.exports = router;
