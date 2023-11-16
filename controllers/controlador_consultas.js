import Consulta from '../models/consulta.js'
import controller_personas from "./controlador_personas.js"
import mongoose from "mongoose";
import Turno from '../models/turno.js';
import Persona from "../models/persona.js"
import Historia_clinica from '../models/historia_clinica.js';

var controller_consulta = {
  // Funcion para guardar las consultas
  verificar_turno_enlazado: async (id_turno) => {
    try {
      const consulta = await Consulta.findOne({ turno: new mongoose.Types.ObjectId(id_turno) });
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
          message: "el turno no esta enlazado con ninguna consulta , lo puedes usar"
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
  guardar_consultaDB: async (sintomas, observacion, fecha, id_turno) => {

    const session = await mongoose.startSession();
    try {
      await session.startTransaction();
      const turno_enlazado = await controller_consulta.verificar_turno_enlazado(id_turno)
      console.log("no paso el turno enlazado");
      if (!turno_enlazado) {
        console.log("paso el turno enlazado");
        const turno = await Turno.findById(id_turno)
        const paciente= await Persona.findById(turno.persona)
        const historia_clinica= await Historia_clinica.findById(paciente.historia_clinica)
        const id_medico = turno.medico;
        let nueva_consulta = new Consulta()
        nueva_consulta.sintomas = sintomas
        nueva_consulta.observacion = observacion
        nueva_consulta.fecha_y_hora = new Date(fecha)
        nueva_consulta.medico = new mongoose.Types.ObjectId(id_medico)
        nueva_consulta.turno = new mongoose.Types.ObjectId(id_turno)


        const consulta_guardada = await nueva_consulta.save();
        if (!consulta_guardada) {
          await session.abortTransaction();
          await session.endSession();
          return "error no se pudo guardar la consulta"
        }
        historia_clinica.consultas.push(consulta_guardada)
        await historia_clinica.save();
        await session.commitTransaction();
        await session.endSession();
        return consulta_guardada._id;
      }else{
      await session.endSession();
      return "error no se pudo guardar la consulta"}
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("No es posible guardar la consulta");
    }
  },

  guardar_consulta: async (req, res) => {
    var params = req.body
    try {

      const consulta_id = await guardar_consultaDB(params.sintomas, params.observacion, params.fecha, params.id_turno);
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
  },
  getById: async (req, res) => {
    try {
        const consultaId = req.params.id; 

        const consulta = await Consulta.findOne({ _id: consultaId });

        if (! consulta) {
            return res.status(404).json({ message: 'Consulta no encontrada' });
        }

        return res.status(200).json(consulta);
    } catch (err) {
        return res.status(500).json({ 
          message: 'Error interno del servidor',
          errors: err.errors
        });
    }
  }

}

export default controller_consulta