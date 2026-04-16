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
router.post("/admin", /* #swagger.tags=['Beneficios'] */ authMiddleware, rolesMiddleware,validarBeneficio, crearBeneficio);
router.put(
  "/admin/desactivar/:id",
  /* #swagger.tags=['Beneficios'] */
  authMiddleware,
  rolesMiddleware,
  desactivarBeneficio
);
router.put(
  "/admin/activar/:id",
  /* #swagger.tags=['Beneficios'] */
  authMiddleware,
  rolesMiddleware,
  activarBeneficio
);
router.get("/admin/listar", /* #swagger.tags=['Beneficios'] */ authMiddleware, listarBeneficios);
router.get("/admin/listar/:id", /* #swagger.tags=['Beneficios'] */ listarBeneficioUnico);
router.put(
  "/admin/modificar/:id",
  /* #swagger.tags=['Beneficios'] */
  authMiddleware,
  rolesMiddleware,
  validarBeneficio,
  modificarBeneficio
);

module.exports = router;

