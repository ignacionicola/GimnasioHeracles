const Datatypes = require("sequelize");
const sequelize = require("../config/db");

const Plan = sequelize.define("Plan", {
  idPlan: {
    type: Datatypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    nombrePlan: {
    type: Datatypes.STRING,
    allowNull: false,
  },
  descripcion:{
    type: Datatypes.STRING,
     allowNull: false,
  },
  precio: {
    type: Datatypes.DECIMAL(10, 2),
    allowNull: false,
  }
}, {
  tableName: "Planes",
  timestamps: true,
});


module.exports = Plan;