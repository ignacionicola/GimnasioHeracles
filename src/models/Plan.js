const {DataTypes} = require("sequelize");
const sequelize = require("../config/db");

const Plan = sequelize.define("Plan", {
  idPlan: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
    nombrePlan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion:{
    type: DataTypes.STRING,
     allowNull: false,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: "Planes",
  timestamps: true,
});


module.exports = Plan;