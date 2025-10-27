const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UsuarioSistema = sequelize.define(
  "UsuarioSistema",
  {
    idUsuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombreUsuario: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    rol: {
      type: DataTypes.STRING(15),
      allowNull: false,
    },
    contrasenia: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    correoUsuario: {
      type: DataTypes.STRING(50),
    },
    telefonoUsuario: {
      type: DataTypes.STRING(20),
    },
    salt: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
  },
  {
    tableName: "UsuarioSistema",
    timestamps: false, // no agregamos createdAt ni updatedAt
  }
);

module.exports = UsuarioSistema;
