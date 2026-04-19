const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./src/config/db");
const responseHandler = require("./src/middlewares/responseHandler");
const errorHandler = require("./src/middlewares/errorHandler");
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');

// Cargar modelos
require("./src/models/UsuarioSistema");
require("./src/models/Beneficios");
require("./src/models/usuario");
require("./src/models/Cuota");
require("./src/models/relaciones");
const authRoutes = require("./src/routes/authRoutes");
const usuarioRouter = require("./src/routes/usuarioRouter");
const beneficiosRouter = require("./src/routes/beneficioRouter");
const cuotaRouter = require("./src/routes/cuotaRouter");
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
app.use("/api/cuotas", cuotaRouter);
// Sincronizar base de datos
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});

// Manejo de errores
app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;