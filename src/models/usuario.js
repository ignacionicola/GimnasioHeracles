const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Usuario = sequelize.define("Usuario", {
  dni: { type: DataTypes.STRING, unique: true, allowNull: false },
  rol: { type: DataTypes.STRING, defaultValue: "usuario" }
}, {
  tableName: "usuarios"
});

module.exports = Usuario;
