import mongoose from 'mongoose'
import Especialidad from "../models/especialidad.js";
import TratamientoFarmacologico from "../models/tratamiento_farmacologico.js";

var controller = {

  obtenerEspecialidades: async (req, res) => {
    try {
      const especialidades = await Especialidad.find({ })
      .select("_id nombre")
      .sort({ nombre: 1 }); // 1 para orden ascendente
      
      if (especialidades.length === 0) {
        return res.status(404).send({
          message: "No se encontraron especialidades"
        })
      }

      return res.status(200).send(especialidades)
    } catch (err) {
      return res.status(500).json({ 
        message: 'Error interno del servidor',
        errors: err.errors
      });
    }
  },
  getById: async (req, res) => {
    try {
        const especialidadId = req.params.id; 

        const especialidad = await Especialidad.findOne({ _id: especialidadId });

        if (! especialidad) {
            return res.status(404).json({ message: 'Especialidad no encontrada' });
        }

        return res.status(200).json(especialidad);
    } catch (err) {
        return res.status(500).json({ 
          message: 'Error interno del servidor',
          errors: err.errors
        });
    }
  },
  obtenerTratamientosFarmacologicosConEspecialidad: async (req, res) => {
    const params = req.params
      
      const especialidadId = new mongoose.Types.ObjectId(params.id);
      
      try {
        const resultado = await TratamientoFarmacologico.aggregate([
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
          },
          {
            $project: {
              _id: 1
            }
          }
        ])

        if (resultado.length === 0) {
          return res.status(404).send({
            'message': 'No se obtuvieron tratamientos farmacologicos con la especialidad seleccionada'
          })
        }

        const soloIDs = resultado.map((item) => item._id);

        return res.status(200).send(soloIDs);
      } catch (err) {
        return res.status(500).json({ 
          message: 'Error interno del servidor',
          errors: err.errors
        });
      }
  },

}

export default controller