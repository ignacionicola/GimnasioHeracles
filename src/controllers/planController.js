const Plan = require("../models/Plan");

//POST - Crear nuevo plan
async function crearPlan(req, res) {
  const { nombrePlan, descripcion, precio } = req.body;
    if (!nombrePlan || !descripcion || !precio) {
    return res.error("Faltan campos obligatorios: nombrePlan, descripcion y precio", 400);
    }
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


module.exports = {
  crearPlan,
  obtenerPlanes,
  actualizarPlan,
};