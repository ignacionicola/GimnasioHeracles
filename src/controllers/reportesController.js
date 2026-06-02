const Usuario = require("../models/usuario");
const Cuota = require("../models/Cuota");
const { Op } = require("sequelize");
const { query, validationResult } = require("express-validator");

// GET - Foto del gimnasio en una fecha puntual (total de socios, activos e inactivos)
const getReporte = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.error("Datos invalidos", 400, errors.array());
  }

  const { fecha } = req.query;

  // Punto de referencia: el final del dia elegido (23:59:59.999).
  // Asi se incluye todo lo que paso durante ese dia, sin importar la hora.
  const finDelDia = new Date(fecha + "T23:59:59.999");

  // Fecha limite: si la fechaVencimiento de la ultima cuota es anterior a esto,
  // el socio estaba cancelado (inactivo) en esa fecha.
  const fechaLimite = new Date(finDelDia);
  fechaLimite.setDate(fechaLimite.getDate() - 60);

  try {
    // 1. Socios que ya existian en esa fecha
    const socios = await Usuario.findAll({
      where: { createdAt: { [Op.lte]: finDelDia } },
      attributes: ["dni", "nombre", "apellido"],
    });

    // 2. Todas las cuotas pagadas hasta esa fecha, de mas nueva a mas vieja
    const cuotas = await Cuota.findAll({
      where: { fechaPago: { [Op.lte]: finDelDia } },
      order: [["fechaPago", "DESC"]],
    });

    // 3. Quedarme con la ultima cuota de cada socio
    const ultimaCuotaPorSocio = {};
    for (const cuota of cuotas) {
      if (!ultimaCuotaPorSocio[cuota.idSocio]) {
        ultimaCuotaPorSocio[cuota.idSocio] = cuota;
      }
    }

    // 4. Clasificar cada socio segun el estado de su ultima cuota en esa fecha
    const activos = [];
    const inactivos = [];

    for (const socio of socios) {
      const ultimaCuota = ultimaCuotaPorSocio[socio.dni];
      const estabaActivo =
        ultimaCuota && new Date(ultimaCuota.fechaVencimiento) >= fechaLimite;

      if (estabaActivo) {
        activos.push(socio);
      } else {
        inactivos.push(socio);
      }
    }

    // 5. Armar el resumen
    const total = socios.length;
    const resumen = {
      fecha,
      totalSocios: total,
      activos: activos.length,
      inactivos: inactivos.length,
      porcentajeActivos: total
        ? ((activos.length / total) * 100).toFixed(1)
        : "0.0",
      porcentajeInactivos: total
        ? ((inactivos.length / total) * 100).toFixed(1)
        : "0.0",
    };

    res.success({ resumen, detalle: { activos, inactivos } });
  } catch (error) {
    res.error(error.message, 500);
  }
};

const validarReporte = [
  query("fecha")
    .notEmpty()
    .withMessage("La fecha es obligatoria")
    .isISO8601()
    .withMessage("La fecha debe tener formato valido (YYYY-MM-DD)"),
];

module.exports = {
  getReporte,
  validarReporte,
};
