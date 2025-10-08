const crypto = require("crypto");

function generarSalt() {
  return crypto.randomBytes(16).toString("hex");
}

function hashPassword(password, salt) {
  const hash = crypto.createHmac("sha256", salt).update(password).digest("hex");
  return hash;
}

module.exports = { hashPassword, generarSalt };