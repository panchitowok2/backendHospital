import express from 'express'
import controlador_medicamentos from '../controllers/controlador_medicamentos.js'
import Especialidad from '../models/especialidad.js'

const router = express.Router()

const validarRequestMedicamentos = (req, res, next) => {
    // Comprueba si las propiedades 'from' y 'message' están presentes y no están vacías
    if (!req.body.fecha_inicio || !req.body.fecha_final || !req.body.especialidad) {
      return res.status(500).json({ error: 'Las propiedades "fecha_inicio", "fecha_final" y "especialidad" son requeridas' });
    }

    const fechaInicio = new Date(req.body.fecha_inicio);
    const fechaFinal = new Date(req.body.fecha_final);

    // Verifica si las fechas son válidas
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFinal.getTime())) {
        return res.status(500).json({ error: 'Las fechas proporcionadas no son válidas' });
    }

    // Aceptar la solicitud
    next();
};

const verificarEspecialidad = async (req, res, next) => {
    try {
      const especialidad = await Especialidad.findOne({ _id: req.body.especialidad }).exec();
      
      if (!especialidad) {
        return res.status(404).json({ mensaje: 'Especialidad no encontrada' });
      }
     
      // Aceptar la solicitud
      next();
    } catch (error) {
      return res.status(500).json({ mensaje: 'Error interno del servidor. '+error });
    }
};

// Ruta para obtener datos de persona
router.get('/buscarMedicamentosMasRecetados', validarRequestMedicamentos, verificarEspecialidad, controlador_medicamentos.buscarMedicamentosMasRecetados)

export default router