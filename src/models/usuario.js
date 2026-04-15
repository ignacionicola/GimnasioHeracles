const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Usuario = sequelize.define("Usuario", {
  dni: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
  nombre: { type: DataTypes.STRING, allowNull: false },
  apellido: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  telefono: { type: DataTypes.STRING },
  puntos: { type: DataTypes.INTEGER, defaultValue: 0 },
  plan:{type: DataTypes.STRING, allowNull: false, defaultValue: "basico"},
}, {
  tableName: "usuarios"
});

module.exports = Usuario;
