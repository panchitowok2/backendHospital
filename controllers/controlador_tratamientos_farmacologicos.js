import mongoose from 'mongoose'
import TratamientoFarmacologico from '../models/tratamiento_farmacologico.js'
import HistoriaClinica from '../models/historia_clinica.js'
import Dosificacion from '../models/dosificacion.js'

var controller = {
  /* 
  * Precondiciones:
  * diagnostico es un ObjectId valido
  * medico es un ObjectId valido
  * historia_clinica es un ObjectId valido
  * dosificaciones es un array y no esta vacio
  */
  altaTratamientoFarmacologico: async (req, res) => {
    var params = req.body

    const session = await mongoose.startSession();
    var dosificaciones = []
    var nuevoTratamientoFarmacologico = null

    try {
      // Inicia la transacción
      await session.startTransaction();

      for (const dosificacion of params.dosificaciones) {
        const nuevaDosificacion = new Dosificacion({
          dosis: dosificacion.dosis,
          medicamento: dosificacion.medicamento
        });

        // Guardar la dosificación en la base de datos
        await nuevaDosificacion.save({ session });
        dosificaciones.push(nuevaDosificacion._id);
      }

      nuevoTratamientoFarmacologico = new TratamientoFarmacologico({
        "descripcion": params.descripcion,
        "fecha_inicio": params.fecha_inicio,
        "duracion": params.duracion,
        "diagnostico": params.diagnostico,
        "medico": params.medico,
        "dosificaciones": dosificaciones
      });

      await nuevoTratamientoFarmacologico.save({ session });

      const tratamientoId = nuevoTratamientoFarmacologico._id;

      await HistoriaClinica.updateOne(
        { _id: params.historia_clinica },
        { $push: { tratamientos_farmacologicos: tratamientoId } },
        { session: session }
      );

      await session.commitTransaction();

    } catch (err) {
      await session.abortTransaction();

      return res.status(500).send({
        "message": 'Ha ocurrido un error al ejecutar la transacción', 
        "errors": err.errors
      });
    }

    session.endSession();

    return res.status(200).send(nuevoTratamientoFarmacologico)
  },
  buscarTratamientosFarmacologicosEnLaFecha: async (req, res) => {
    const params = req.query
    
    const fechaInicio = new Date(params.fecha_inicio)
    const fechaFinal = new Date(params.fecha_final)

    try {
      const resultado = await TratamientoFarmacologico.aggregate([
        {
          $match: {
            fecha_inicio: {
              $gte: fechaInicio,
              $lte: fechaFinal
            }
          }
        }
      ])

      if (resultado.length === 0) {
        return res.status(404).send({
          'message': 'No se obtuvieron tratamientos farmacologicos en el rango de fechas seleccionado'
        })
      }
  
      return res.status(200).send(resultado);
    } catch (err) {
      return res.status(500).json({ 
        message: 'Error interno del servidor',
        errors: err.errors
      });
    }
  }

}

export default controller


