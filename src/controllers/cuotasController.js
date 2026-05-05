const Cuota = require("../models/Cuota");
const Usuario = require("../models/usuario");
const { Op, literal } = require("sequelize");
const Plan = require("../models/Plan");
const {body, validationResult} = require("express-validator");
async function renovarCuota(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error("Errores de validación", 400, errors.array());
  }
  const { idSocio, idPlan, metodoPago } = req.body;
  try {
    const plan = await Plan.findByPk(idPlan);
    if (!plan) {
      return res.error("Plan no encontrado", 404);
    }
    const monto = plan.precio;
    const nombrePlan = plan.nombrePlan;
    const nuevaCuota = await Cuota.create({
      idSocio,
      monto,
      nombrePlan,
      metodoPago,
    });
    await Usuario.update({ activo: true }, { where: { dni: idSocio } });
    res.success(nuevaCuota);
  } catch (error) {
    res.error(error.message, 500);
  }
}

async function actualizarEstadoCuota(req, res) {
  const { idCuota } = req.params;
  const { estado } = req.body;
  try {
    const cuota = await Cuota.findByPk(idCuota);
    if (!cuota) {
      return res.error("Cuota no encontrada", 404);
    }
    await cuota.update({ estado }, { where: { idCuota } });
    res.success(cuota);
  } catch (error) {
    res.error(error.message, 500);
  }
}

async function obtenerCuotasPorSocio(req, res) {
  const { idSocio } = req.params;
  try {
    const cuotas = await Cuota.findAll({
      where: { idSocio },
      include: [{ model: Usuario, attributes: ["dni", "nombre", "apellido"] }],
      order: [["fechaPago", "DESC"]],
    });
    res.success(cuotas);
  } catch (error) {
    res.error(error.message, 500);
  }
}

const validarRenovacion = [
  body("idSocio").notEmpty().withMessage("El ID del socio es obligatorio"),
  body("idPlan").notEmpty().withMessage("El ID del plan es obligatorio"),
  body("metodoPago").notEmpty().isString().withMessage("El método de pago es obligatorio"),
];

module.exports = {
  renovarCuota,
  actualizarEstadoCuota,
  obtenerCuotasPorSocio,
  validarRenovacion,
};
