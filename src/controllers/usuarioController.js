const Usuario = require("../models/usuario");
const { body, validationResult } = require("express-validator");
const crypto = require("crypto");
const { hashPassword } = require("../service/hashService");




async function crearUsuario(req, res) {
  const error = validationResult(req); //Validación de datos que llegan en el request 
  if (!error.isEmpty()) {
    //Si hay errores, lo devuelve
    return res.error("Error al crear usuario", 400, error.array());
  }
  
  const salt = crypto.randomBytes(16).toString("hex"); //Genera la "sal", un hash random para darle mas seguridad al hash del password.
  const password = hashPassword(req.body.password, salt); // Crea el hash de la contraseña con la sal generada

  try {
    const nuevoUsuario = await new Usuario({ // Crea el nuevo usuario en la BD
      nombreUsuario: req.body.nombreUsuario,
      email: req.body.email,
      salt: salt,
      password: password,
      rol: "cliente",
    });
    await nuevoUsuario.save(); // Se guarda en la BD
    res.success(nuevoUsuario);//retorna el usuario creado
  } catch (error) {
    res.error("Error al crear usuario");
  }
}

async function obtenerUsuarios(req, res) { //Obtiene todos los usuarios de la base de datos
    try {
    const usuarios = await Usuario.find().select("-salt"); //Busca todos los usuarios y elimina el campo salt de la respuesta porque no es necesario enviarlo al cliente.
    if (usuarios.length === 0) {
      //Si no hay usuarios, devuelve un mensaje
      return res.success({ data: "Sin ususarios" });
    }
    
    res.success(usuarios); //Devuelve los usuarios encontrados
  } catch (error) {
    res.error(error.message);
  }
}
async function eliminarUsuario(req, res) {
  try {
    const usuario = await Usuario.findOneAndDelete({ //Busca y borra un usuario por su nombre de usuario
      nombreUsuario: req.params.nombreUsuario,
    });
    if (!usuario) { //Si no lo encuentra, devuelve error
      return res.error("Usuario no encontrado",404);
    }
    res.success(usuario); //Se retorna el usuario eliminado
  } catch (error) {
    res.error("Error al eliminar usuario");
  }
}

async function actualizarUsuario(req, res) {
  const usuarioParam = req.params.nombreUsuario; //Recibe por parametro el nombre del usuario a actualizar
  const errors = validationResult(req); //Valida los datos que llegan en el request
  //Si no hay errores, se procede a actualizar el usuario
  if (!errors.isEmpty()) { //Si hay errores se devuelve el error
    return res.error("Datos nuevos no validos", 400, errors.array());
  }
  //En caso de estar todo bien guarda los datos nuevos para actualizar los viejos
  const datosActualizados = req.body;

  try {
    const usuario = await Usuario.findOneAndUpdate( //Se busca y actualiza el usuario correspondiente
      { nombreUsuario: usuarioParam }, //Busca por el nombre de usuario que llega por parametro y lo actualizo
      datosActualizados, 
      { new: true } //Devuelve el usuario actualizado
    );
    if (!usuario) {
      return res.error("Usuario no encontrado");
    }
    res.success(usuario);
  } catch (error) {
    res.error("Error al actualizar el usuario");
  }
}
const validarUsuarioNuevo = [
  body("nombreUsuario")
    .trim()
    .notEmpty()
    .isString()
    .isLength({ min: 5, max: 15 })
    .withMessage("Minimo 5 caracteres y maximo 15 caracteres"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("Recuerdo que un email tiene el formato algo@algo.algo"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Minimo 6 caracteres"),
];



module.exports = {
  obtenerUsuarios,
  crearUsuario,
  eliminarUsuario,
  actualizarUsuario,
  validarUsuarioNuevo,
};

