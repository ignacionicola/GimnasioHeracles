const cron = require("node-cron");
const Cuota = require("../models/cuota");
const { Op } = require("sequelize");
const Usuario = require("../models/usuario");
const sequelize = require("../config/db");
// Tarea programada para actualizar el estado de las cuotas vencidas
const verificarCuotasVencidas = async () => {
  const hoy = new Date();
  const hace60dias = new Date();
  hace60dias.setDate(hace60dias.getDate() - 60);

  await Cuota.update(
    { estado: "vencida" },
    { where: { fechaVencimiento: { [Op.lt]: hoy }, estado: "pagada" } },
  );

  await Cuota.update(
    { estado: "cancelada" },
    { where: { fechaVencimiento: { [Op.lt]: hace60dias }, estado: "vencida" } },
  );

  await Usuario.update(
    { activo: false },
    {
      where: {
        dni: {
          [Op.in]: sequelize.literal(
            `(SELECT idSocio FROM Cuotas WHERE estado = 'cancelada' AND fechaPago = (SELECT MAX(fechaPago) FROM Cuotas c2 WHERE c2.idSocio = Cuotas.idSocio))`,
          ),
        },
      },
    },
  );
  console.log("Verificacion de cuotas ejecutada: ", new Date());
};

const iniciarTareas = () => {
  cron.schedule("*/2 * * * *", verificarCuotasVencidas, {
    timezone: "America/Argentina/Buenos_Aires",
  }); //Ejecuta cada 2 minutos para probarlo
  console.log("Tareas programadas iniciadas");
};

module.exports = {
  iniciarTareas,
};
