const express = require("express");
const router = express.Router();
const {actualizarPlan,crearPlan,obtenerPlanes,
validarPlan, validarActualizacionPlan
 } = require("../controllers/planController");

// POST - Crear nuevo plan
router.post("/admin", /* #swagger.tags=['Planes'] */ validarPlan, crearPlan);

// GET - Obtener todos los planes
router.get("/", /* #swagger.tags=['Planes'] */ obtenerPlanes);

// PUT - Actualizar un plan existente
router.put("/admin/:id", /* #swagger.tags=['Planes'] */ validarActualizacionPlan, actualizarPlan);


module.exports = router;