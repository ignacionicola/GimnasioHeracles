const express = require("express");
const router = express.Router();
const {actualizarPlan,crearPlan,obtenerPlanes, eliminarPlan } = require("../controllers/planController");

// POST - Crear nuevo plan
router.post("/admin", /* #swagger.tags=['Planes'] */ crearPlan);

// GET - Obtener todos los planes
router.get("/", /* #swagger.tags=['Planes'] */ obtenerPlanes);

// PUT - Actualizar un plan existente
router.put("/admin/:id", /* #swagger.tags=['Planes'] */ actualizarPlan);

// DELETE - Eliminar un plan
router.delete("/admin/:id", /* #swagger.tags=['Planes'] */ eliminarPlan);

module.exports = router;