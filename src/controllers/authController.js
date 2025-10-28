const jwt = require("../service/jwtService");
const Usuario = require("../models/usuario");
const UsuarioSistema = require("../models/UsuarioSistema");
const { hashPassword } = require("../service/hashService");

async function login(req, res) {
  const { dni, nombreUsuario, contrasenia } = req.body;
  try {
    let resultado;
    
    if (dni) {
      // Login de usuario/recepcionista por DNI
      const usuario = await Usuario.findOne({ where: { dni } });
      if (!usuario) throw new Error("DNI inválido");
      
      resultado = {
        token: jwt.generarToken({ 
          id: usuario.id, 
          dni: usuario.dni, 
          rol: usuario.rol 
        }),
        user: {
          id: usuario.id,
          dni: usuario.dni,
          nombre: usuario.nombre,
          rol: usuario.rol
        }
      };
    } else if (nombreUsuario && contrasenia) {
      // Login de administrador
      const admin = await UsuarioSistema.findOne({ 
        where: { nombreUsuario } 
      });
      if (!admin) throw new Error("Credenciales inválidas");
      
      const hash = hashPassword(contrasenia, admin.salt);
      if (hash !== admin.contrasenia) {
        throw new Error("Credenciales inválidas");
      }
      
      resultado = {
        token: jwt.generarToken({
          id: admin.id,
          email: admin.correoUsuario,
          rol: admin.rol
        }),
        user: {
          id: admin.id,
          correoUsuario: admin.correoUsuario,
          rol: admin.rol
        }
      };
    } else {
      throw new Error("Datos de login inválidos");
    }

    res.cookie("auth-token", resultado.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
      path: "/",
      maxAge: 3600000
    });

    res.json(resultado);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

function logout(req, res) {
  res.clearCookie("auth-token", { path: "/" });
  res.json({ message: "Sesión cerrada" });
}

module.exports = { login, logout };