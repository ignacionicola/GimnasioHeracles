const { body, validationResult } = require("express-validator");
const Producto = require("../models/producto");

const validarProducto = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ max: 100 })
    .withMessage("Maximo 100 caracteres"),

  body("precio")
    .isFloat({ gt: 0 })
    .withMessage("El precio debe ser mayor a 0")
    .toFloat(),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("El stock debe ser mayor a 0")
    .toInt(),
];

async function crearProducto(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    //Si hay algun error, retorna error
    return res.error("Errores de validacion", 400, errors.array());
  }
  try { // Creo un nuevo producto con los datos que llegan por el request
  // y se guarda en la base de datos
    const nuevoProducto = new Producto(req.body); // Crea una instancia del modelo Producto con los datos del request
    const guardado = await nuevoProducto.save(); // Guarda el producto en la base de datos
    res.success(guardado, 201); 
  } catch (err) {
    next(err)
  }
}

async function listarProductos(req, res) {
  //Devuelve todos los productos de la bd
  try {
    const productos = await Producto.find(); // aca el find esta vacio porque busca todos los productos
    res.success(productos); // Devuelve los productos encontrados
  } catch (err) {
    res.error("Error al listar productos", 500);
  }
}

async function eliminarProducto(req, res) {
  //Busca un producto por su nombre que llegar por la URL
  try {
    const producto = await Producto.find({ nombre: req.params.nombre }); //Busca un producto y lo filtra por su nombre
    if (producto.length === 0) { // Si no encuentra el producto, retorna un error
      return res.error("Producto no encontrado", 404);
    }

    await Producto.deleteOne({ nombre: req.params.nombre }); // Elimina el producto encontrado
    res.success(producto);
  } catch (err) {
    res.error("Error al eliminar producto", 500);
  }
}




module.exports = {
  listarProductos,
  crearProducto,
  validarProducto,
  eliminarProducto,
};
