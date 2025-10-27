const express = require("express");
//const jwt = require("jsonwebtoken");
require("dotenv").config(); //Dotenv para manejar variables de entorno
const sequelize = require("./config/db"); //conexion a mongodb
const responseHandler = require("./middlewares/responseHandler");
const errorHandler = require("./middlewares/errorHandler"); 
const cookies = require("cookie-parser"); //Cookies para poder utilizar las cookies
const cors  = require("cors"); //Cors para usar mi frontend en react
const app = express();
const PORT = process.env.PORT || 3000;
app.use(responseHandler);
app.use(cookies());
app.use(cors({credentials:true , origin:"http://localhost:5173"}));
app.use(express.json()); //Ayuda al servidor a "Hablar en JSON"
//rutas
const usuarioRouter = require("./routes/usuarioRouter");
const authRouter = require("./routes/authRoutes");

//Uso de rutas
app.use("/api/usuarios", usuarioRouter);
app.use("/api/auth", authRouter);
app.listen(PORT, (req, res) => {
  console.log(`Servidor corriendo: http://localhost:${PORT}`);
});


app.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    res.send("✅ Conexión con MySQL exitosa");
  } catch (error) {
    console.error("❌ Error al conectar con MySQL:", error);
    res.status(500).send("Error de conexión");
  }
});
//Manejo de errores
app.use(errorHandler);


sequelize.sync({ alter: true }) // crea o actualiza la tabla si hace falta
  .then(() => console.log("📦 Tablas sincronizadas correctamente"))
  .catch((err) => console.error("❌ Error al sincronizar:", err));
module.exports = app;
