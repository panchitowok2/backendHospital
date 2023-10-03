
import consulta from "../models/consulta";
import Diagnostico from "../models/diagnostico";
import enfermedad from "../models/enfermedad";
import Historia_clinica from "../models/historia_clinica";
var controller_diagnostico = {
    guardar_diagnosticoDB: async (observacion, descripcion, id_consulta, id_enfermedad, id_paciente) => {
        try {
            let nuevo_diagnostico = new Diagnostico()
            nuevo_diagnostico.observaciones = observacion
            nuevo_diagnostico.descripcion = descripcion
            nuevo_diagnostico.consulta = id_consulta
            nuevo_diagnostico.enfermedad = id_enfermedad

            const diagnostico_guardada = await nuevo_diagnostico.save();
            if (!diagnostico_guardada) {
                return "error no se pudo guardar el diagnostico"

            }
            const historia_clinica = await Historia_clinica.findById(id_paciente);
            historia_clinica.diagnosticos.push(diagnostico_guardada)
            await historia_clinica.save();
            return diagnostico_guardada._id;
        } catch (error) {
            throw new Error("No es posible guardar el diagnostico");

        }
    },

    guardar_diagnostico: async (req, res) => {
        try {
            var params = req.body
            const diagnostico_id = await guardar_diagnosticoDB(params.observacion, params.descripcion, params.id_consulta, params.id_enfermedad, params.id_paciente)
            if (diagnostico_id == "error no se pudo guardar el diagnostico") {
                return res.status(404).send({
                    error: true,
                    message: "no se pudo guardar el diagnostico",
                });

            }

            return res.status(200).send(diagnostico_id)
        } catch (error) {
            return res.status(500).send({
                error: true,
                message: "error al guardar el diagnostico por motivos externos"
            })
        }
    },

    obtener_diagnosticos_por_enfermedad: async (id_enfermedad, fecha_inicio,fecha_fin) => {
        try {
            const resultados = Diagnostico.aggregate([
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
                        as: "persona"
                    }
                },
                {
                    $unwind: "$persona"
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
                        as: "persona"
                    }
                },
                {
                    $unwind: "$persona"
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
                    $unwind: "$tratamiento_farmacologico"
                },
                {
                    $lookup: {
                        from: "dosificacion",
                        localField: "tratamiento_farmacologico.dosificacion",
                        foreignField: "_id",
                        as: "dosificacion"
                    }
                },
                {
                    $unwind: "$dosificacion"
                },
                {
                    $lookup: {
                        from: "medicamento",
                        localField: "dosificacion.medicamento",
                        foreignField: "_id",
                        as: "medicamento"
                    }
                },
                {
                    $unwind: "$medicamento"
                },

                {
                    $match: {
                        "consulta.fecha_y_hora": fecha,
                        "enfermedad._id": id_enfermedad
                    }
                }
            ])
        if (!resultados) {
            return null;
            
        }
    const resultado_final= resultados.map(resultado=>({
        _id:consulta._id,
        fecha_y_hora:resultado.consulta.fecha_y_hora,
        enfermedad:resultado.enfermedad.nombre,
        sintomas:resultado.consulta.sintomas,
        medico_nombre:resultado.consulta.medico.persona.nombre,
        medico_apellido:resultado.medico.persona.apellido,
        paciente_nombre:resultado.turno.persona.nombre,

    }))
} catch (error) {

        }
    }

}
export default controller_diagnostico