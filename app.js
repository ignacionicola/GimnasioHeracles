const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./src/config/db");
const responseHandler = require("./src/middlewares/responseHandler");
const errorHandler = require("./src/middlewares/errorHandler");

// Cargar modelos
require("./src/models/UsuarioSistema");
require("./src/models/Beneficios");

const authRoutes = require("./src/routes/authRoutes");
const usuarioRouter = require("./src/routes/usuarioRouter");
const beneficiosRouter = require("./src/routes/beneficioRouter");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(responseHandler);
app.use(cors({
  origin: "http://localhost:5173", // frontend 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/beneficios", beneficiosRouter);

// Sincronizar base de datos
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});

// Manejo de errores
app.use(errorHandler);

module.exports = app;