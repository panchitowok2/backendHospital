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

      console.log('Tratamiento creado y agregado a la historia clínica con éxito.');

    } catch (err) {
      await session.abortTransaction();

      console.error('Error en la operación:' + err);

      return res.status(500).send({
        "message": 'Ha ocurrido un error al ejecutar la transacción', 
        "errors": err.errors
      });
    }

    session.endSession();

    return res.status(200).send(nuevoTratamientoFarmacologico)
  },

}

export default controller


