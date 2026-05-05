const Plan = require("../models/Plan");
const { body, validationResult, param } = require("express-validator");
//POST - Crear nuevo plan
async function crearPlan(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error("Errores de validación", 400, errors.array());
  }
  const { nombrePlan, descripcion, precio } = req.body;
  try {
    const nuevoPlan = await Plan.create({ nombrePlan, descripcion, precio });
    res.success(nuevoPlan);
  } catch (error) {
    res.error(error.message, 500);
  }
}

// GET - Obtener todos los planes
async function obtenerPlanes(req, res) {
  try {
    const planes = await Plan.findAll();
    res.success(planes);
  } catch (error) {
    res.error(error.message, 500);
  }
}

// PUT - Actualizar un plan existente
async function actualizarPlan(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error("Errores de validación", 400, errors.array());
  }
  const { id } = req.params;
  const { nombrePlan, descripcion, precio } = req.body;
  try {
    const plan = await Plan.findByPk(id);
    if (!plan) {
      return res.error("Plan no encontrado", 404);
    }
    await plan.update({ nombrePlan, descripcion, precio });
    res.success(plan);
  } catch (error) {
    res.error(error.message, 500);
  }
}

const validarPlan = [
  body("nombrePlan")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("El nombre del plan es obligatorio"),
  body("descripcion")
    .trim()
    .notEmpty()
    .isString()
    .withMessage("La descripción del plan es obligatoria"),
  body("precio")
    .notEmpty()
    .withMessage("El precio del plan es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El precio del plan debe ser un número mayor que 0"),
];

const validarActualizacionPlan = [
  param("id").notEmpty().withMessage("El ID del plan es obligatorio"),
  body("nombrePlan")
    .optional()
    .trim()
    .isString()
    .withMessage("El nombre del plan debe ser una cadena no vacía"),
  body("descripcion")
    .optional()
    .trim()
    .isString()
    .withMessage("La descripción del plan debe ser una cadena no vacía"),
  body("precio")
    .optional()
    .notEmpty()
    .withMessage("El precio del plan es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El precio del plan debe ser un número mayor que 0"),
];

module.exports = {
  crearPlan,
  obtenerPlanes,
  actualizarPlan,
  validarPlan,
  validarActualizacionPlan,
};
