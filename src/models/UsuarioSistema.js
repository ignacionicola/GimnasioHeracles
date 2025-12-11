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
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    rol: {
      type: DataTypes.STRING(15),
      allowNull: false,
      defaultValue: "recepcionista",
    },
    contrasenia: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    correoUsuario: {
      type: DataTypes.STRING(100),
      unique: true,
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
    tableName: "usuarios_sistema",
    timestamps: true,
  }
);

module.exports = UsuarioSistema;
