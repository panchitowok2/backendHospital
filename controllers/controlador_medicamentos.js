import mongoose from 'mongoose'
import TratamientoFarmacologico from '../models/tratamiento_farmacologico.js'

var controller = {
  /* Funcion para buscar medicamentos mas recetados
  * 
  *   select medicamento.id, medicamento.nombre, count(*)
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

      console.log(params)

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
            medicamento: 1, // Conserva el campo medicamento
            count: 1 // Conserva el campo count
          }
        }
      ])
    
      return res.status(200).send(resultado);
    },  
}

export default controller


