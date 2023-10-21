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
  altaTratamientoFarmacologico: async (req, res) => 
  {
    var params = req.body

    const session = await mongoose.startSession();
    var tratamiento = null

    try 
    {
      // Inicia la transacción
      session.startTransaction();

      const tratamientos = await TratamientoFarmacologico.create([params], { session: session });
      tratamiento = tratamientos[0];
      const tratamientoId = tratamiento._id;
      console.log("El nuevo tratamiento es " + tratamientoId);


      await HistoriaClinica.updateOne(
        { _id: params.historia_clinica },
        { $push: { tratamientos_farmacologicos: tratamientoId } },
        { session: session }
      );

      for (const dosificacion of params.dosificaciones) {
        const nuevaDosificacion = new Dosificacion({
          dosis: dosificacion.dosis,
          medicamento: dosificacion.medicamento
        });
            
        // Guardar la dosificación en la base de datos
        await nuevaDosificacion.save({ session });
      }

      await session.commitTransaction();

      console.log('Tratamiento creado y agregado a la historia clínica con éxito.');

    } catch (err) {
      await session.abortTransaction();

      console.error('Error en la operación:' +err);

      return res.status(500).send({
          status: 'Error',
          message: 'Ha ocurrido un error en la operación'
        });
      }

      session.endSession();

      return res.status(200).send({
        status: 'Success',
        tratamiento,
      })
  },
     
}

export default controller


