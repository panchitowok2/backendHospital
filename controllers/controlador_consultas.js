import Consulta from '../models/consulta.js'

var controller = {
     // Funcion para guardar las consultas
     save: (req, res) => {
      var params = req.body
      var message = new Consulta()
      message.message = params.message
      message.from = params.from
  
      message.save().then(messageStored => { 
        if (!messageStored) {
          return res.status(404).send({
              status: 'Error',
              message: 'No ha sido posible guardar el mensaje'
          })
        }
  
        return res.status(200).send({
          status: 'Success',
            messageStored
        })
      }).catch(error => {
        return res.status(404).send({
          status: 'Error',
          message: 'No ha sido posible guardar el mensaje'
        })
      })
  },
      // Funcion para obtener todos los mensajes
      getMessages: (req, res) => {
        Message.find({})
          .sort('-_id')
          .then((messages) => {
            if (messages.length === 0) {
              return res.status(404).send({
                status: 'Error',
                message: 'No hay mensajes para mostrar'
              });
            }
      
            return res.status(200).send({
              status: 'Success',
              messages
            });
          })
          .catch((error) => {
            return res.status(500).send({
              status: 'Error',
              message: 'Error al extraer los datos'
            });
          });
      }
      
}

export default controller