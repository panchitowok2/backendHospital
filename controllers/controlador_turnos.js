import Turno from "../models/turno.js";
import Medico from "../models/medico.js";
import mongoose from "mongoose";
import controller_consulta from "./controlador_consultas.js";

//cuando ingresemos las horas usar formato 24hr es decir en vez de 9:30 usar 09:30 es decir agregar el 0 adelante
var controller_turno = {

  buscar_turno: async (fecha1, id_medico, id_paciente) => {
    try {
      console.log("inicio el metodo");
      const fechaEntrada=fecha1
      fechaEntrada.setHours(0, 0, 0, 0);
      console.log("llego antes del find");
      const turnos = await Turno.find({
        fecha: { $gte:fechaEntrada},
        medico: new mongoose.Types.ObjectId(id_medico),
        persona: new mongoose.Types.ObjectId(id_paciente)
      })
        .populate("persona");
        
        console.log("paso el find");
      if (!turnos || turnos.length===0) {
        return null;

      }

      const turno_info1=[]
      for(const turno of turnos){
        const enlazado=controller_consulta.verificar_turno_enlazado
      }
      const turnos_info = turnos.map(turno => ({
        _id: turno._id,
        fecha: turno.fecha,
        hora:turno.hora,
        persona: `${turno.persona.nombre} ${turno.persona.apellido}`,
      }));
      return turnos_info;
    } catch (error) {
      throw new Error('No ha sido posible buscar los médicos');
    }

  },

  obtener_turno: async (req, res) => {
    let params = req.body;
    try {
      console.log("entro el request");
      const turno_info = await controller_turno.buscar_turno(new Date(params.fecha), params.id_medico, params.id_paciente);
      if (!turno_info) {
        return res.status(404).send({
          error: true,
          message: "no existen turnos"
        });


      }
      return res.status(200).send(turno_info)
    } catch (error) {
      return res.status(500).send({
        error: true,
        message: "error al buscar turnos"
      })

    }
  },

}
export default controller_turno