const express = require("express");
const router = express.Router();
const {
  crearBeneficio,
  desactivarBeneficio,
  activarBeneficio,
  listarBeneficios,
  listarBeneficioUnico,
  modificarBeneficio,
  validarBeneficio
} = require("../controllers/beneficiosController");
const authMiddleware = require("../middlewares/authMiddleware");
const rolesMiddleware = require("../middlewares/rolesMiddleware");
router.post("/admin", authMiddleware, rolesMiddleware,validarBeneficio, crearBeneficio);
router.put(
  "/admin/desactivar/:id",
  authMiddleware,
  rolesMiddleware,
  desactivarBeneficio
);
router.put(
  "/admin/activar/:id",
  authMiddleware,
  rolesMiddleware,
  activarBeneficio
);
router.get("/admin/listar", authMiddleware, listarBeneficios);
router.get("/admin/listar/:id", listarBeneficioUnico);
router.put(
  "/admin/modificar/:id",
  authMiddleware,
  rolesMiddleware,
  validarBeneficio,
  modificarBeneficio
);

module.exports = router;

