const express = require("express");
const router = express.Router();
const { crearCuota, obtenerCuotas, actualizarEstadoCuota } = require("../controllers/cuotasController");

// POST - Crear nueva cuota
/** @swagger
 * /components:
 *   schemas:
 *     Cuota:
 *       type: object
 *       properties:
 *         idSocio:
 *           type: integer
 *           description: ID del socio
 *         monto:
 *           type: number
 *           format: float
 *           description: Monto de la cuota
 */
router.post("/", crearCuota);
// GET - Obtener todas las cuotas
router.get("/", obtenerCuotas);
// PUT - Actualizar estado de una cuota
router.put("/:idCuota/estado", actualizarEstadoCuota);

module.exports = router;