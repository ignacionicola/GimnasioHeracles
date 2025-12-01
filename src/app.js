const express = require("express");
const cors = require("cors");
// ...código existente...

const app = express();

// CORS configurado para permitir frontend en localhost:5173 (Vite)
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:3173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());
// ...código existente...