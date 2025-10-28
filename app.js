const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");
const usuarioRouter = require("./src/routes/usuarioRouter");

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({
  origin: "http://localhost:5173", // frontend 
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/usuarios", usuarioRouter);

// Sincronizar base de datos
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
});

module.exports = app;