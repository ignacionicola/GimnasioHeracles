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

module.exports = {
  crearCuota,
};
