const express = require("express");
const router = express.Router();
const {
  actualizarPlan,
  crearPlan,
  obtenerPlanes,
  validarPlan,
  validarActualizacionPlan,
} = require("../controllers/planController");
const authMiddleware = require("../middlewares/authMiddleware");
const verificarAdmin = require("../middlewares/rolesMiddleware");
// POST - Crear nuevo plan
router.post(
  "/admin",
  /* #swagger.tags=['Planes'] */ authMiddleware,
  verificarAdmin,
  validarPlan,
  crearPlan,
);

// GET - Obtener todos los planes
router.get("/", /* #swagger.tags=['Planes'] */ authMiddleware, obtenerPlanes);

// PUT - Actualizar un plan existente
router.put(
  "/admin/:id",
  /* #swagger.tags=['Planes'] */ authMiddleware,
  verificarAdmin,
  validarActualizacionPlan,
  actualizarPlan,
);

module.exports = router;
