const Cuota = require("../models/Cuota");
const Usuario = require("../models/usuario");
const { Op, literal } = require("sequelize");
async function crearCuota(req, res) {
  const { idSocio, monto } = req.body;
  if (!idSocio || !monto) {
    return res.error("Faltan campos obligatorios: idSocio y monto", 400);
  }
  try {
    const nuevaCuota = await Cuota.create({ idSocio, monto });
    res.success(nuevaCuota);
  } catch (error) {
    res.error(error.message, 500);
  }
}

async function obtenerUltimaCuotaPorSocio(req, res) {
  try {
    const cuotas = await Cuota.findAll({
      include: [{ model: Usuario, attributes: ["dni", "nombre", "apellido"] }],
      where: {
        fechaPago: {
          [Op.eq]: literal(`(
        SELECT MAX(c2."fechaPago")
        FROM "Cuotas" c2
        WHERE c2."idSocio" = "Cuota"."idSocio"
      )`),
        },
      },
    });

    res.success(cuotas);
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

module.exports = {
  crearCuota,
  obtenerUltimaCuotaPorSocio,
  actualizarEstadoCuota,
  obtenerCuotasPorSocio,
};
