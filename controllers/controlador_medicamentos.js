import mongoose from 'mongoose'
import TratamientoFarmacologico from '../models/tratamiento_farmacologico.js'
import Medicamento from '../models/medicamento.js'

var controller = {
  /* Funcion para buscar medicamentos mas recetados
  * 
  *  select medicamento.id, medicamento.nombre, count(*)
  *  from tratamiento_farmacologico
  *  inner join medico on tratamiento_farmacologico.medico_id = medico .id
  *  inner join especialidad on medico.especialidad_id = especialidad.id
  *  inner join dosificacion on tratamiento_farmacologico.id = dosificacion.tratamiento_farmacologico_id
  *  inner join medicamento on dosificacion.medicamento_id = medicamento.id
  *  where especialidad.id = $especialidadId and tratamiento_farmacologico.fecha between $fechaInicio and $fechaFinal 
  *  group by medicamento.id, medicamento.nombre
  */

  /* 
  * Precondiciones:
  * especialidad es un objeto valido
  * las fechas tienen formato valido
  */
    buscarMedicamentosMasRecetados: async (req, res) => {

      const params = req.body

      const fechaInicio = new Date(params.fecha_inicio)
      const fechaFinal = new Date(params.fecha_final)
      const especialidadId = new mongoose.Types.ObjectId(params.especialidad);

      const resultado = await TratamientoFarmacologico.aggregate([
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
        },
        {
          $lookup: {
            from: 'dosificacion',
            localField: 'dosificaciones',
            foreignField: '_id',
            as: 'dosificacion'
          }
        },
        {
          $unwind: "$dosificacion"
        },
        {
          $lookup: {
            from: 'medicamento',
            localField: 'dosificacion.medicamento',
            foreignField: '_id',
            as: 'medicamento'
          }
        },
        {
          $unwind: "$medicamento"
        },
        {
          "$group": {
            _id: "$medicamento",
            count: {
              $sum: 1
            },
            medicamento: {
              $first: "$medicamento" // Conservar información sobre el medicamento
            }
          }
        },
        {
          $project: {
            _id: 0, // Elimina el campo _id de la salida
            //medicamento: 1, // Conserva el campo medicamento
            count: 1, // Conserva el campo count
            "medicamento.droga": 1,
            "medicamento.nombre": 1,
            "medicamento.presentacion": 1,
            "medicamento._id": 1
          }
        },
        {
          $sort: {
            count: -1 // Ordenar de manera descendente por el campo "count"
          }
        }
      ])
    
      return res.status(200).send(resultado);
    },  
    obtenerMedicamentos: async (req, res) => {
      const { filter } = req.body;
  
      const medicamentos = await Medicamento.find({
        $or: [
          { nombre: { $regex: new RegExp(filter, "i") } },
          { droga: { $regex: new RegExp(filter, "i") } }
        ]
      }).select("_id nombre droga presentacion")
      .sort({ nombre: 1 }); // 1 para orden ascendente
      
      if (medicamentos.length === 0) {
        return res.status(404).send({
          message: "No se encontraron medicamentos que coincidan con el filtro proporcionado"
        })
      }
  
      return res.status(200).send(medicamentos)
    },
}

export default controller


