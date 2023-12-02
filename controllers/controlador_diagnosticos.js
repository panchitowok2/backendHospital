
import Diagnostico from "../models/diagnostico.js";
import Historia_clinica from "../models/historia_clinica.js";
import controlador_consulta from "./controlador_consultas.js";
import mongoose from "mongoose";
import { format } from "date-fns";
import diagnostico from "../models/diagnostico.js";

var controller_diagnostico = {
  guardar_diagnosticoDB: async (observacion, descripcion, id_consulta, id_enfermedad, id_historia_clinica,session) => {


    try {
      await session.startTransaction();
      let nuevo_diagnostico = new Diagnostico()
      nuevo_diagnostico.observaciones = observacion

      nuevo_diagnostico.descripcion = descripcion

      nuevo_diagnostico.consulta = id_consulta

      nuevo_diagnostico.enfermedad = new mongoose.Types.ObjectId(id_enfermedad)
      const historia_clinica = await Historia_clinica.findById(id_historia_clinica);
      const diagnostico_guardada = await nuevo_diagnostico.save();
      console.log("se hizo el save");
      if (!diagnostico_guardada || historia_clinica==null) {
        await session.abortTransaction();
        await session.endSession();
        return "error no se pudo guardar el diagnostico"

      }

  
      historia_clinica.diagnosticos.push(diagnostico_guardada)
      await historia_clinica.save();
      await session.commitTransaction();
      await session.endSession();
      return diagnostico_guardada._id;
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();
      throw new Error("No es posible guardar el diagnostico");

    }
  },

  guardar_diagnostico: async (req, res) => {
    try {
      var params = req.body
      const session = await mongoose.startSession();
      const id_consulta = await controlador_consulta.guardar_consultaDB(params.sintomas_consultas, params.observacion_consulta, params.fecha_consulta, params.id_turno,params.id_historia_clinica,session)

      if (id_consulta=="error no se pudo guardar la consulta") {
        return res.status(404).send({
          error: true,
          message: "no se pudo guardar el diagnostico por problemas con la consulta",
        });
      }
      const diagnostico_id = await controller_diagnostico.guardar_diagnosticoDB(params.observacion_diagostico, params.descripcion_diagnostico, id_consulta, params.id_enfermedad, params.id_historia_clinica,session)
      if (diagnostico_id == "error no se pudo guardar el diagnostico") {
        return res.status(404).send({
          error: true,
          message: "no se pudo guardar el diagnostico",
        });

      }
      console.log("guardado el diagnostico el id es: " + diagnostico_id);
      return res.status(200).send(diagnostico_id)
    } catch (error) {
      return res.status(500).send({
        error: true,
        message: "error al guardar el diagnostico por motivos externos"
      })
    }
  },
  obtener_diagnosticos_por_enfermedad: async (req, res) => {
    try {
      let params = req.body

      const resultado = await controller_diagnostico.obtener_diagnosticos_por_enfermedadDB(params.id_enfermedad, new Date(params.fecha_inicio), new Date(params.fecha_fin))
      if (resultado == null) {
        return res.status(404).send({
          error: true,
          message: "no no hay diagnosticos con esa enfermedad",
        });

      }
      return res.status(200).send(resultado)

    } catch (error) {
      return res.status(500).send({
        error: true,
        message: "error no se pudo realizar la consulta de las enfermedades"
      })

    }
  },

  obtener_diagnosticos_por_enfermedadDB: async (id_enfermedad, fecha_inicio, fecha_fin) => {
    try {
      const resultados = await Diagnostico.aggregate([
        {
          $lookup: {
            from: "enfermedad",
            localField: "enfermedad",
            foreignField: "_id",
            as: "enfermedad"
          }
        },
        {
          $unwind: "$enfermedad"
        },
        {
          $lookup: {
            from: "consulta",
            localField: "consulta",
            foreignField: "_id",
            as: "consulta"
          }
        },
        {
          $unwind: "$consulta"
        },
        {
          $lookup: {
            from: "turno",
            localField: "consulta.turno",
            foreignField: "_id",
            as: "turno"
          }
        },
        {
          $unwind: "$turno"
        },
        {
          $lookup: {
            from: "persona",
            localField: "turno.persona",
            foreignField: "_id",
            as: "paciente"
          }
        },
        {
          $unwind: "$paciente"
        },
        {
          $lookup: {
            from: "medico",
            localField: "consulta.medico",
            foreignField: "_id",
            as: "medico"
          }
        },
        {
          $unwind: "$medico"
        },
        {
          $lookup: {
            from: "persona",
            localField: "medico.persona",
            foreignField: "_id",
            as: "datos_del_medico"
          }
        },
        {
          $unwind: "$datos_del_medico"
        },
        {
          $lookup: {
            from: "tratamiento_farmacologico",
            localField: "_id",
            foreignField: "diagnostico",
            as: "tratamiento_farmacologico"
          }
        },
        {
          $unwind: {
            path: "$tratamiento_farmacologico",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $lookup: {
            from: "dosificacion",
            localField: "tratamiento_farmacologico.dosificaciones",
            foreignField: "_id",
            as: "dosificaciones"
          }
        },
        {
          $unwind: {
            path: "$dosificaciones",
            preserveNullAndEmptyArrays: true,
          }
        },
        {
          $lookup: {
            from: "medicamento",
            localField: "dosificaciones.medicamento",
            foreignField: "_id",
            as: "medicamento"
          }
        },
        {
          $unwind: {
            path: "$medicamento",
            preserveNullAndEmptyArrays: true,
          }
        },/**/

        {
          $match: {
            "consulta.fecha_y_hora": {
              $gte: fecha_inicio,
              $lte: fecha_fin,
            },
            "enfermedad._id": new mongoose.Types.ObjectId(id_enfermedad)
          }
        },
        {
          $addFields: {
            // Establecer en null si no existe
            tratamiento_farmacologico: {
              $ifNull: ["$tratamiento_farmacologico", null],
            },
            dosificaciones: {
              $ifNull: ["$dosificaciones", null],
            },
            medicamento: {
              $ifNull: ["$medicamento", null],
            },
          },
        }, {
          $group: {
            _id: "$_id",
            observaciones: { $first: "$observaciones" },
            consulta: { $first: "$consulta" },
            enfermedad: { $first: "$enfermedad" },
            turno: { $first: "$turno" },
            paciente: { $first: "$paciente" },
            medico: { $first: "$medico" },
            datos_del_medico: { $first: "$datos_del_medico" },
            tratamiento_farmacologico: { $first: "$tratamiento_farmacologico" },
            dosificaciones: { $first: "$dosificaciones" },
            medicamento: { $first: "$medicamento" }
          },
        },

      ])
      if (!resultados || resultados.length === 0) {
        return null;

      }
      // return resultados


      const resultado_final = resultados.map(resultado => {
        const tratamiento_farmacologico = resultado.tratamiento_farmacologico ? {
          id_tratamiento: resultado.tratamiento_farmacologico._id,
          descripcion_tratamiento_farmacologico: resultado.tratamiento_farmacologico.descripcion,
          nombre_medicamento: resultado.medicamento.nombre,
          presentacion_medicamento: resultado.medicamento.presentacion,
          dosis: resultado.dosificaciones.dosis,
          fecha_inicio: format((new Date(resultado.tratamiento_farmacologico.fecha_inicio)), 'dd/MM/yyyy'),
          duracion: resultado.tratamiento_farmacologico.duracion,
        } : null;
        return {
          consulta: {
            id_consulta: resultado.consulta._id,
            fecha_consulta: format((new Date(resultado.consulta.fecha_y_hora)), 'dd/MM/yyyy HH:mm'),
            sintomas: resultado.consulta.sintomas,
            observacion: resultado.consulta.observacion,
            medico_consulta: {
              id_medico: resultado.medico._id,
              legajo: resultado.medico.legajo,
              nombre: resultado.datos_del_medico.nombre,
              apellido: resultado.datos_del_medico.apellido,

            },
            paciente_consulta: {
              id_paciente: resultado.paciente._id,
              nombre: resultado.paciente.nombre,
              apellido: resultado.paciente.apellido,
              tipo_documento: resultado.paciente.tipo_documento,
              documento: resultado.paciente.documento,
              sexo: resultado.paciente.sexo,
              direccion: resultado.paciente.direccion,
              telefono: resultado.paciente.telefono,

            },
            diagnostico: {
              _id: resultado._id,
              observaciones: resultado.observaciones,
              enfermedad: resultado.enfermedad.nombre,
              tratamiento_farmacologico


            },
          }
        }
      })
      console.log(resultado_final);
      return resultado_final;
    } catch (error) {

    }
  },
  getById: async (req, res) => {
    try {
      const diagnosticoId = req.params.id;

      const diagnostico = await Diagnostico.findOne({ _id: diagnosticoId });

      if (!diagnostico) {
        return res.status(404).json({ message: 'Diagnóstico no encontrado' });
      }

      return res.status(200).json(diagnostico);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error interno del servidor' });
    }
  },
  buscar_diagnosticos_por_enfermedadDB: async(id_enfermedad)=>{
    const resultados=await Diagnostico.find({enfermedad:new mongoose.Types.ObjectId(id_enfermedad)})
    if ( resultados.length==0) {
      return null;
      
    }
    return resultados;
  },
  buscar_diagnosticos_por_enfermedad:async(req,res)=>{
    try {
      const params=req.body;
      const diagnosticos= await controller_diagnostico.buscar_diagnosticos_por_enfermedadDB(params.id_enfermedad)

      if (diagnosticos==null) {
        return res.status(404).json({
          error: true,
          message: 'Diagnósticos no encontrado' });
      }
      return res.status(200).json(diagnosticos);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: true,
        message: 'Error interno del servidor' });
    }

  }


}
export default controller_diagnostico