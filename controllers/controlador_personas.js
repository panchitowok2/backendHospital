//importamos el modelo de mongoose
import Persona from '../models/persona.js'

var controller = {
     // Funcion para guardar los mensajes
     buscarPersona: (req, res) => {
      var params = req.body
      
      Persona.findOne({
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
  }

}

export default controller;