import Consulta from '../models/consulta.js'
import controller_personas from "./controlador_personas"

var controller_consulta = {
  // Funcion para guardar las consultas
  verificar_turno_enlazado: async (id_turno) => {
    try {
      const consulta = await Consulta.findOne({ turno: id_turno });
      if (!consulta) {
        return false;

      }
      return true;
    } catch (error) {
      throw new Error('No ha sido posible buscar si el turno ya fue asignado a una consulta');
    }
  },
  verificar_turno: async (req, res) => {
    let params = req.body;
    try {
      const verificar_turno = await controller_consulta.verificar_turno_enlazado(params.id_turno)
      if (!verificar_turno) {
        return res.status(404).send({
          error: true,
          message: "no hay turno enlazado"
        })

      }
      return res.status(200).send({
        error: false,
        message: "el turno esta enlazado"
      })
    } catch (error) {
      return res.status(500).send({
        error: true,
        message: "error al buscar turno"
      });

    }


  },
  guardar_consultaDB: async (sintomas, observacion, fecha, id_medico, id_turno) => {
    try {

      let nueva_consulta = new Consulta()
      nueva_consulta.sintomas = sintomas
      nueva_consulta.observacion = observacion
      nueva_consulta.fecha_y_hora = fecha
      nueva_consulta.medico = id_medico
      nueva_consulta.turno = id_turno

      const consulta_guardada = await nueva_consulta.save();
      if (!consulta_guardada) {
        return "error no se pudo guardar la consulta"
      }
      return consulta_guardada._id;
    } catch (error) {
      throw new Error("No es posible guardar la consulta");
    }
  },

  guardar_consulta: async (req, res) => {
    var params = req.body
    try {
      const consulta_id = await guardar_consultaDB(params.sintomas, params.observacion, params.fecha, params.id_medico, params.id_turno);
      if (consulta_id == "error no se pudo guardar la consulta") {
        return res.status(404).send({
          error: true,
          message: "no se pudo guardar la consulta",
        });

      }
      return res.status(200).send(consulta_id)
    } catch (error) {
      return res.status(500).send({
        error: true,
        message: "error al guardar consulta por motivos externos"
      })
    }
  }
}

export default controller_consulta