const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const connectDB = require("./src/config/db");
const responseHandler = require("./src/middlewares/responseHandler");
const errorHandler = require("./src/middlewares/errorHandler");
const cookies = require("cookie-parser");

// Rutas
const usuarioRouter = require("./src/routes/usuarioRouter");
const authRouter = require("./src/routes/authRoutes");
const productoRouter = require("./src/routes/productoRouter");

const app = express();
const PORT = process.env.PORT || 3000;

// Conexión a la base de datos
connectDB();

// Middlewares globales
app.use(express.json()); // es para que pueda leer y entender el json
app.use(cookies()); // Manejar cookies
app.use(responseHandler); // Respuestas personalizadas
app.use(express.static("public")); // Servir archivos estáticos

// Rutas de la API
app.use("/api/productos", productoRouter);
app.use("/api/usuarios", usuarioRouter);
app.use("/api/usuarios", authRouter);

// Middleware de manejo de errores 
app.use(errorHandler);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo: http://localhost:${PORT}`);
});

// Exportar la app para testing
module.exports = app;