//importamos el modelo de mongoose
import Persona from '../models/persona.js'
import functions from './functions/functions_personas.js'
import mongoose from 'mongoose';

var controller = {
  // Funcion para guardar los mensajes
  buscarPersona: async (req, res) => {
    var params = req.body

    const resultado = await functions.buscarPersona(params)
    if (!resultado) {
      return res.status(404).send({
        error: true,
        message: 'No existe la persona'
      })
    }
    return res.status(200).send(resultado)

    //console.log(resultado)
  },
  //Verifica si una persona esta cargada en el sistema. Si existe devuelve un mensaje,
  //si no existe devuelve error.
  verificarPersona: async (req, res) => {
    var params = req.body

    const resultado = await functions.buscarPersona(params)
    if (!resultado) {
      return res.status(404).send({
        error: true,
        message: 'No existe la persona'
      })
    }
    return res.status(200).send({
      sucess: true,
      message: 'Existe la persona :)'
    })
  },

  //da de alta una persona en el sistema.
  altaPersona: async (req, res) => {
    var params = req.body;
    const session = await mongoose.startSession();
    var persona = null;

    try {
      //inicio la transaccion
      session.startTransaction();

      const personas = await Persona.create([params], { session: session });
      persona = personas[0];
      const personaId = persona._id;
      console.log("La nueva persona es: " + personaId);

      //termino la transaccion 
      await session.commitTransaction();
      console.log("Persona creada y guardada con exito :D")
    } catch (err) {
      await session.abortTransaction();
      console.error("Error en la operacion: " + err);
      return res.status(500).send({
        status: 'error',
        message: 'Ha ocurrido un error en la operacion.'
      });
    }
    session.endSession();

    return res.status(200).send({
      status: 'Sucess',
      persona,
    })
  }
}

export default controller;