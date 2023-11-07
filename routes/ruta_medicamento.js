import express from 'express'
import controlador_medicamentos from '../controllers/controlador_medicamentos.js'
import Especialidad from '../models/especialidad.js'
import TratamientoFarmacologico from '../models/tratamiento_farmacologico.js'
import mongoose from 'mongoose'

const router = express.Router()

const validarRequestMedicamentos = (req, res, next) => {
    // Comprueba si el usuario envio todos los parametros necesarios
    if (!req.body.fecha_inicio || !req.body.fecha_final || !req.body.especialidad) {
      return res.status(400).json({ message: 'Las propiedades "fecha_inicio", "fecha_final" y "especialidad" son requeridas' });
    }

    const fechaInicio = new Date(req.body.fecha_inicio);
    const fechaFinal = new Date(req.body.fecha_final);

    // Verifica si las fechas son válidas
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFinal.getTime())) {
        return res.status(400).json({ message: 'Las fechas proporcionadas no son válidas' });
    }

    // Aceptar la solicitud
    next();
};

const verificarEspecialidad = async (req, res, next) => {
    try {
      const especialidad = await Especialidad.findOne({ _id: req.body.especialidad }).exec();
      
      if (!especialidad) {
        return res.status(404).json({ message: 'Especialidad no encontrada' });
      }
     
      // Aceptar la solicitud
      next();
    } catch (err) {
      return res.status(500).json({ 
        message: 'Error interno del servidor',
        errors: err.errors
      });
    }
};

const existenTratamientosEnEsaFecha = async (req, res, next) => {
  const params = req.body
  const fechaInicio = new Date(params.fecha_inicio)
  const fechaFinal = new Date(params.fecha_final)

  try {
    
    const tratamientos = await TratamientoFarmacologico.aggregate([
      {
        $match: {
          fecha_inicio: {
            $gte: fechaInicio,
            $lte: fechaFinal
          }
        }
      },
    ])

    if (tratamientos.length === 0) {
      return res.status(404).json({ message: 'No existen tratamientos para el rango de fechas seleccionado' });
    }
   
    // Aceptar la solicitud
    next();
  } catch (err) {
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      errors: err.errors
    });
  }
};

const existenTratamientosRealizadosPorMedicosConEsaEspecialidad = async (req, res, next) => {
  const params = req.body
  const fechaInicio = new Date(params.fecha_inicio)
  const fechaFinal = new Date(params.fecha_final)
  const especialidadId = new mongoose.Types.ObjectId(params.especialidad);

  try {
    
    const tratamientos = await TratamientoFarmacologico.aggregate([
      {
        $match: {
          fecha_inicio: {
            $gte: fechaInicio,
            $lte: fechaFinal
          }
        }
      },
      {
        $lookup: {
          from: 'medico',
          localField: 'medico',
          foreignField: '_id',
          as: 'medico'
        }
      },
      {
        $lookup: {
          from: 'especialidad',
          localField: 'medico.especialidades',
          foreignField: '_id',
          as: 'especialidad'
        }
      },
      {
        $unwind: "$especialidad"
      },
      {
        $match: {
          "especialidad._id": especialidadId
        }
      }
    ])

    if (tratamientos.length === 0) {
      return res.status(404).json({ message: 'No existen tratamientos realizados por medicos con dicha especialidad en el rango de fechas seleccionado' });
    }
   
    // Aceptar la solicitud
    next();
  } catch (err) {
    return res.status(500).json({ 
      message: 'Error interno del servidor',
      errors: err.errors
    });
  }
};

const existenTratamientosEnEsaFechaConDosificaciones = async (req, res, next) => {
  const params = req.body
  const fechaInicio = new Date(params.fecha_inicio)
  const fechaFinal = new Date(params.fecha_final)
  const especialidadId = new mongoose.Types.ObjectId(params.especialidad);

  try {
    
    const tratamientos = await TratamientoFarmacologico.aggregate([
      {
        $match: {
          fecha_inicio: {
            $gte: fechaInicio,
            $lte: fechaFinal
          }
        }
      },
      {
        $addFields: {
          numeroDosificaciones: { $size: "$dosificaciones" }
        }
      },
      {
        $match: {
          numeroDosificaciones: { $gt: 0 }
        }
      },
      {
        $lookup: {
          from: 'medico',
          localField: 'medico',
          foreignField: '_id',
          as: 'medico'
        }
      },
      {
        $lookup: {
          from: 'especialidad',
          localField: 'medico.especialidades',
          foreignField: '_id',
          as: 'especialidad'
        }
      },
      {
        $unwind: "$especialidad"
      },
      {
        $match: {
          "especialidad._id": especialidadId
        }
      }
    ]);
    

    if (tratamientos.length === 0) {
      return res.status(404).json({ message: 'No existen tratamientos con dosificaciones para el rango de fechas seleccionado' });
    }

    console.log(tratamientos)
   
    // Aceptar la solicitud
    next();
  } catch (err) {
    return res.status(500).json({ 
      message: 'Error interno del serviddor',
      errors: err.errors
    });
  }
};



// Ruta para obtener datos de persona
router.post('/obtenerMedicamentos', controlador_medicamentos.obtenerMedicamentos)
router.post('/buscarMedicamentosMasRecetados', validarRequestMedicamentos, verificarEspecialidad, existenTratamientosEnEsaFecha, existenTratamientosRealizadosPorMedicosConEsaEspecialidad, existenTratamientosEnEsaFechaConDosificaciones, controlador_medicamentos.buscarMedicamentosMasRecetados)

export default router