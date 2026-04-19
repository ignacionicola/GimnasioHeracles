const Usuario = require("./usuario");
const Cuota = require("./Cuota");

// Usuario - Cuota: Un usuario puede tener muchas cuotas, y cada cuota pertenece a un usuario específico.
Usuario.hasMany(Cuota, { foreignKey: "idSocio", sourceKey: "dni" });
Cuota.belongsTo(Usuario, { foreignKey: "idSocio", targetKey: "dni" });