const jwt = require("../service/jwtService");
const Usuario = require("../models/usuario");
const { hashPassword } = require("../service/hashService");

async function login(req, res) { 
  
  const usuarioLogin = req.body;
  try {
    // Verifica si el usuario existe y las credenciales son correctas
    const resultado = await loginUsuario(usuarioLogin);
    // Si las credenciales son correctas, se crea un token y se envía como cookie
    res.cookie("cookie-token", resultado.token, {
      // Config la cookie con el token
      httpOnly: true, // No accesible desde JS
      secure: false, // falso porque toy usando http, si fuera https deberia ser true
      sameSite: "Strict",  
      maxAge: 3600000,
    });
    res.json(resultado); //En caso de exito devuelve el token
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

async function loginUsuario(usuarioLogin) {
  //Verifica que el usuario exista en la base de datos
  const usuarioBD = await Usuario.findOne({ email: usuarioLogin.email }); 

  if (!usuarioBD) {
    // Si no existe el usuario, lanza un error
    throw new Error("Credenciales invalidas");
  }

  //Si existe se hashea la contraseña con el salt del usuario de la Bd, para poder comparar
  const hash = hashPassword(usuarioLogin.password, usuarioBD.salt);
  if (!(hash === usuarioBD.password)) {
    throw new Error("Credenciales invalidas");
  }

  //Creación del token
  const payload = {
    id: usuarioBD.id,
    email: usuarioLogin.email,
    rol: usuarioBD.rol,
  };

  const token = jwt.generarToken(payload); // Genera el token con el payload y la clave secreta
  
  return {
    token,
    user: { id: usuarioBD.id, email: usuarioLogin.email, rol: usuarioBD.rol }, //Devuelvo el token y el usuario 
  };
}

module.exports = { login };
