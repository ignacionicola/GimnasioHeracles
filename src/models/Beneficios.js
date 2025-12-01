const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Beneficios = sequelize.define(
  "Beneficios",
  {
    idBeneficio: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreBeneficio: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    descripcionBeneficio: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    precioPuntos:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    activo:{
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  },
  {
    tableName: "Beneficios",
    timestamps: false, // no agregamos createdAt ni updatedAt
  }
);

module.exports = Beneficios;

