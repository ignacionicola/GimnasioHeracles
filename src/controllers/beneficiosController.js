const Beneficios = require("../models/Beneficios");

async function crearBeneficio(req, res, next) {
  try {
    const nuevoBeneficio = await Beneficios.create(req.body);
    res.success(nuevoBeneficio);
  } catch (error) {
    res.error(error.message, 500);
  }
}

async function desactivarBeneficio(req, res) {
  try {
    const beneficio = await Beneficios.findByPk(req.params.id);
    if (!beneficio) {
      return res.error("Beneficio no encontrado", 404);
    }
    beneficio.activo = false;
    await beneficio.save();
    res.success(beneficio);
  } catch (error) {
    res.error(error.message, 500);
  }
}

async function activarBeneficio(req, res) {
  try {
    const beneficio = await Beneficios.findByPk(req.params.id);
    if (!beneficio) {
      return res.error("Beneficio no encontrado", 404);
    }
    beneficio.activo = true;
    await beneficio.save();
    res.success(beneficio);
  } catch (error) {
    res.error(error.message, 500);
  }
}

async function listarBeneficios(req, res) {
  try {
    const beneficios = await Beneficios.findAll();
    res.success(beneficios);
  } catch (error) {
    res.error(error.message, 500);
  }
}

async function listarBeneficioUnico(req, res) {
  try {
    const beneficio = await Beneficios.findByPk(req.params.id);
    if (!beneficio) {
      return res.error("Beneficio no encontrado", 404);
    }
    res.success(beneficio);
  } catch (error) {
    res.error(error.message, 500);
  }
}

async function modificarBeneficio(req, res) {
  try {
    const beneficio = await Beneficios.findByPk(req.params.id);
    if (!beneficio) {
      return res.error("Beneficio no encontrado", 404);
    }
    // log para debug: mostrar payload entrante
    console.log('[modificarBeneficio] id:', req.params.id, 'body:', req.body);

    const { nombreBeneficio, descripcionBeneficio, precioPuntos } = req.body;
    
    if (nombreBeneficio === undefined || descripcionBeneficio === undefined || precioPuntos === undefined) {
      return res.error("Faltan campos requeridos", 400);
    }

  // mostrar estado antes
  console.log('[modificarBeneficio] antes:', beneficio.toJSON());

  beneficio.nombreBeneficio = nombreBeneficio;
  beneficio.descripcionBeneficio = descripcionBeneficio;
  beneficio.precioPuntos = precioPuntos;

  // mostrar estado despues de asignar
  console.log('[modificarBeneficio] despues asignar:', beneficio.toJSON());

    await beneficio.save();
    res.success(beneficio.toJSON());
  } catch (error) {
    console.error('Error al modificar beneficio:', error);
    res.error(error.message, 500);
  }
}


module.exports = {
  crearBeneficio,
  desactivarBeneficio,
  activarBeneficio,
  listarBeneficios,
  listarBeneficioUnico,
  modificarBeneficio,
};

