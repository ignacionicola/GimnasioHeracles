const jwt = require("../service/jwtService");
const Usuario = require("../models/UsuarioSistema");
const { hashPassword } = require("../service/hashService");
async function login(req, res) {
  //Recibe el body del request
  const usuarioLogin = req.body;
  try {
    // Averigua si el usuario existe y las credenciales s((on correctas
    const resultado = await loginUsuario(usuarioLogin);
    res.cookie("token", resultado.token, {
      httpOnly: true, //La cookie no es accesible desde el navegador
      secure: false, // Para decidir si solo enviarlas en HTTPS
      sameSite: "lax",
      maxAge: 600000,
    });
    res.success(resultado); //En caso de exito devuelve el token
  } catch (error) {
    res.error(error.message, 401, "Credenciales invalidas en login frontends");
  }
}

function logout(req, res) {
  res.clearCookie("token");
  res.status(200).json({ success: true, msg: "Cookie borrada" });
}
async function loginUsuario(usuarioLogin) {
  //Verifica que el usuario exista en la base de datos
  const usuarioBD = await Usuario.findOne({
    where: { nombreUsuario: usuarioLogin.nombreUsuario },
  });
  if (!usuarioBD) {
    throw new Error("Credenciales invalidas por user");
  }
  //Si existe se hashea la contraseña con el salt del usuario de la Bd, para poder comparar
  const hash = hashPassword(usuarioLogin.contrasenia, usuarioBD.salt);
  if (!(hash === usuarioBD.contrasenia)) {
    throw new Error(
      "Credenciales invalidas" + usuarioBD.contrasenia + "\n" + hash
    );
  }
  //Creación del token
  const payload = {
    id: usuarioBD.id,
    email: usuarioBD.correoUsuario,
    rol: usuarioBD.rol,
  };
  const token = jwt.generarToken(payload);

  return {
    token,
    user: {
      id: usuarioBD.id,
      correoUsuario: usuarioBD.correoUsuario,
      rol: usuarioBD.rol,
    },
  };
}

module.exports = { login, logout };
