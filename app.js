const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sequelize = require("./src/config/db");
const responseHandler = require("./src/middlewares/responseHandler");
const errorHandler = require("./src/middlewares/errorHandler");
const cookies = require("cookie-parser");
const cors = require("cors");

// Rutas
const usuarioRouter = require("./src/routes/usuarioRouter");
const authRouter = require("./src/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Habilita CORS para tu frontend (ajusta el origin según tu puerto de React)
app.use(cors({
  origin: "http://localhost:5173", // Cambia el puerto si tu React corre en otro
  credentials: true
}));

// Middlewares globales
app.use(express.json());
app.use(cookies());
app.use(responseHandler);
app.use(express.static("public"));

// Rutas de la API
app.use("/api/usuarios", usuarioRouter);
app.use("/api/usuarios", authRouter);

// Middleware de manejo de errores 
app.use(errorHandler);

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Error al sincronizar la base de datos:", err);
});

// Exportar la app para testing
module.exports = app;