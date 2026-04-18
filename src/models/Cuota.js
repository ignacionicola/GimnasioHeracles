const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Cuota = sequelize.define(
  "Cuota",
  {
    idCuota: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fechaPago:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    estado:{
        type: DataTypes.ENUM("pagada", "vencida","cancelada"),
        allowNull: false,
        defaultValue: "pagada",
    },
    fechaVencimiento:{
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: ()=>{
            const fecha = new Date();
            fecha.setDate(fecha.getDate() + 30); // Vencimiento a 30 días
            return fecha;
        },
    },
        monto:{
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
        idSocio: {
        type: DataTypes.STRING,
        references: {
            model: "usuarios",
            key: "dni",
        },
    },
  },
  {
    tableName: "Cuotas",
    timestamps: true,
  }
);

module.exports = Cuota;
