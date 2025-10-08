const jwt = require("jsonwebtoken");
require("dotenv").config();

function generarToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || "secreto", { expiresIn: "1h" });
}

module.exports = { generarToken };
