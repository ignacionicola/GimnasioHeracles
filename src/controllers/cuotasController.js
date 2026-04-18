const Cuota = require("../models/Cuota");

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

async function obtenerCuotas(req, res) {
  try {
    const cuotas = await Cuota.findAll();
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
    await cuota.update({ estado }, {where:{idCuota}});
    res.success(cuota);
  } catch (error) {
    res.error(error.message, 500);
  }
}

async function obtenerCuotasPorSocio(req, res) {
  const { idSocio } = req.params;
  try {
    const cuotas = await Cuota.findAll({ where: { idSocio } });
    res.success(cuotas);
  } catch (error) {
    res.error(error.message, 500);
  }
}


module.exports = {
  crearCuota,
  obtenerCuotas,
  actualizarEstadoCuota
  ,obtenerCuotasPorSocio
};
