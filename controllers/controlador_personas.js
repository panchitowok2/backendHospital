//importamos el modelo de mongoose
import Persona from '../models/persona.js'

var controller = {
  // Funcion para guardar los mensajes
  buscarPersona: (req, res) => {
    var params = req.body

    Persona.find({
      tipo_documento: params.tipo_documento,
      documento: params.documento,
      sexo: params.sexo,
      apellido: params.apellido
    }).then(personaBuscada => {
      //si la persona no pude ser encontrada devuelve este error    
      if (!personaBuscada) {
        return res.status(404).send({
          error: true,
          message: 'No existe la persona'
        })
      }
      //si la persona fue encontrada devolvemos esto
      return res.status(200).send({
        tipo_documento: personaBuscada.tipo_documento,
        dni: personaBuscada.dni,
        apellido: personaBuscada.apellido,
        nombre: personaBuscada.nombre,
        sexo: personaBuscada.sexo,
        historia_clinica: personaBuscada.historia_clinica,
      })
    }).catch(error => {
      return res.status(500).send({
        error: true,
        message: 'No ha sido posible buscar el paciente'
      })
    })
  },
  verificarPersona: (req, res) => {
    var params = req.body

    Persona.find({
      tipo_documento: params.tipo_documento,
      documento: params.documento,
      sexo: params.sexo,
      apellido: params.apellido
    }).then(personaBuscada => {
      //si la persona no pude ser encontrada devuelve este error    
      if (!personaBuscada) {
        return res.status(404).send({
          error: true,
          message: 'No existe la persona'
        })
      }
      //si la persona fue encontrada devolvemos esto
      return res.status(200).send({
        message: 'La persona existe :)'
      })
    }).catch(error => {
      return res.status(500).send({
        error: true,
        message: 'No ha sido posible buscar el paciente', error
      })
    })
  },
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
      console.log("La nueva persona es: " + histID);

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
      hist_clinica,
    })
  }
}

export default controller;