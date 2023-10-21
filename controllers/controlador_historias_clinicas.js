import historia_clinica from '../models/historia_clinica.js';
import persona from '../models/persona.js'
import mongoose from 'mongoose';
import controladorPersona from './controlador_personas.js';
import functions from './functions/functions_personas.js'
import functionsConsulta from './functions/functions_consultas.js'
import functionsTratamiento from './functions/functions_tratamientosFarmacologicos.js'
import functionsDiagnostico from './functions/functions_diagnosticos.js';
import functionsMedico from './functions/functions_medico.js';
import functionsDosificacion from './functions/functions_dosificacion.js';

var controller = {
  //buscar historia clinica segun datos de paciente
  buscarHistoriaClinica: async (req, res) => {
    var params = req.body

    var personaBuscada = await functions.buscarPersona(params)
    if (!personaBuscada) {
      return res.status(500).send({
        error: true,
        message: 'La persona no existe en el sistema'
      })
    }
    await historia_clinica.findOne({
      _id: personaBuscada.historia_clinica
    }).then(historiaClinicaBuscada => {
      //si la historia clinica no pude ser encontrada devuelve este error    
      if (!historiaClinicaBuscada) {
        return res.status(404).send({
          error: true,
          message: 'No existe la historia clinica'
        })
      }
      //si la historia clinica fue encontrada devolvemos esto
      return res.status(200).send({
        grupo_sanguineo: historiaClinicaBuscada.grupo_sanguineo,
        factor_sanguineo: historiaClinicaBuscada.factor_sanguineo,
        tratamiento_farmacologico: historiaClinicaBuscada.tratamiento_farmacologico,
        consultas: historiaClinicaBuscada.consultas,
        diagnosticos: historiaClinicaBuscada.diagnosticos,
      })
    }).catch(error => {
      return res.status(500).send({
        error: true,
        message: 'No ha sido posible buscar la historia clinica' + error
      })
    })
  },
  //dar de alta una historia clinica indicando el grupo y factor sanguineo, y los datos del paciente
  altaHistoriaClinica: async (req, res) => {
    var params = req.body;
    const session = await mongoose.startSession();
    var hist_clinica = null;

    try {
      //inicio la transaccion
      session.startTransaction();

      var personaBuscada = await functions.buscarPersona(params)
      if (!personaBuscada) {
        await session.abortTransaction();
        return res.status(500).send({
          error: true,
          message: 'La persona no existe en el sistema'
        })
      }

      if (personaBuscada.historia_clinica) {
        await session.abortTransaction();
        return res.status(500).send({
          error: true,
          message: 'La persona ya tiene historia clinica'
        })
      } else {

        const historicasClinicas = await historia_clinica.create([params], { session: session });
        hist_clinica = historicasClinicas[0];
        const histID = hist_clinica._id;
        console.log("La nueva historia clìnica es: " + histID);

        //asigno historia clinica a persona
        await persona.updateOne(
          {
            documento: params.documento,
            tipo_documento: params.tipo_documento,
            sexo: params.sexo,
            apellido: params.apellido
          },
          { historia_clinica: histID },
          { session: session });
        //termino la transaccion 
        await session.commitTransaction();
        console.log("Historia clinica creada y guardada con exito :D")
      }
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
  },
  /*
  Este metodo verifica si un paciente tiene historia clinica, y luego retorna
  de persona muestro nombre, apellido sexo y dni
  de su historia clinica su grupo_sanguineo y factor_sanguineo
  de las consultas sus sintomas, y fecha
  de los tratamientos su tipo y fecha de inicio
  de los diagnosticos sus observaciones
  medico de cada consulta (nombre y especialidad)
  de la dosificacion de cada tratamiento su dosis y droga
  
  */
  elaborarInformePaciente: async (req, res) => {
    var params = req.body
    try {
      const resultado = await persona.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(params._id)
          }
        },
        {
          $lookup: {
            from: "historia_clinica",
            localField: "historia_clinica",
            foreignField: "_id",
            as: "historia_clinica"
          }
        },
        {
          $lookup: {
            from: "tratamiento_farmacologico",
            localField: "historia_clinica.tratamientos_farmacologicos",
            foreignField: "_id",
            as: "tratamientos_farmacologicos"
          }
        },

        {
          $lookup: {
            from: "consulta",
            localField: "historia_clinica.consultas",
            foreignField: "_id",
            as: "consultas"
          }
        },

        {
          $lookup: {
            from: "diagnostico",
            localField: "tratamientos_farmacologicos.diagnostico",
            foreignField: "_id",
            as: "diagnosticos_tratamiento"
          }
        },
        {
          $lookup: {
            from: "medico",
            localField: "consultas.medico",
            foreignField: "_id",
            as: "medicos"
          }
        },
        {
          $lookup: {
            from: "persona",
            localField: "medicos.persona",
            foreignField: "_id",
            as: "datosPersonalesMedicoQueAtendioConsulta"
          }
        },
        {
          $lookup: {
            from: "medico",
            localField: "tratamientos_farmacologicos.medico",
            foreignField: "_id",
            as: "medicosDeTratamientosFarmacologicos"
          }
        },
        {
          $lookup: {
            from: "persona",
            localField: "medicosDeTratamientosFarmacologicos.persona",
            foreignField: "_id",
            as: "datosPersonalesMedicoQueRecetoTratamientoFarmacologico"
          }
        },
        {
          $lookup: {
            from: "dosificacion",
            localField: "tratamientos_farmacologicos.dosificaciones",
            foreignField: "_id",
            as: "dosificacionesTratamientosFarmacologicos"
          }
        },
        {
          $lookup: {
            from: "medicamento",
            localField: "dosificacionesTratamientosFarmacologicos.medicamento",
            foreignField: "_id",
            as: "medicamentoDosificacion"
          }
        },
        {
          $project: {
            _id: 0, // Elimina el campo _id de la salida
            "historia_clinica._id": 0,
            "historia_clinica.tratamientos_farmacologicos": 0,
            "historia_clinica.consultas": 0,
            "historia_clinica.diagnosticos": 0,
            "historia_clinica.__v": 0,
            "tratamientos_farmacologicos._id": 0,
            "tratamientos_farmacologicos.diagnostico": 0,
            "tratamientos_farmacologicos.medico": 0,
            "tratamientos_farmacologicos.dosificaciones": 0,
            "tratamientos_farmacologicos.__v": 0,
            "consultas._id": 0,
            "consultas.medico": 0,
            "consultas.turno": 0,
            "consultas.__v": 0,
            "diagnosticos_tratamiento._id": 0,
            "diagnosticos_tratamiento.consulta": 0,
            "diagnosticos_tratamiento.enfermedad": 0,
            "diagnosticos_tratamiento.__v": 0,
            "medicos._id": 0,
            "medicos.especialidades": 0,
            "medicos.persona": 0,
            "medicos.__v": 0,
            "datosPersonalesMedicoQueAtendioConsulta._id": 0,
            "datosPersonalesMedicoQueAtendioConsulta.historia_clinica": 0,
            "datosPersonalesMedicoQueAtendioConsulta.__v": 0,
            "medicosDeTratamientosFarmacologicos._id": 0,
            "medicosDeTratamientosFarmacologicos.historia_clinica": 0,
            "medicosDeTratamientosFarmacologicos.__v": 0,
            "datosPersonalesMedicoQueRecetoTratamientoFarmacologico._id": 0,
            "datosPersonalesMedicoQueRecetoTratamientoFarmacologico.historia_clinica": 0,
            "datosPersonalesMedicoQueRecetoTratamientoFarmacologico.__v": 0,
            "dosificacionesTratamientosFarmacologicos._id": 0,
            "dosificacionesTratamientosFarmacologicos.medicamento": 0,
            "dosificacionesTratamientosFarmacologicos.__v": 0,
            "medicamentoDosificacion._id": 0,
            "medicamentoDosificacion.__v": 0,
          }
        }
      ])
      //console.log(resultado[0].medicos)

      const datosMedicosFinal = resultado[0].medicos.map((medico, index) => {
        return {
          datosMedico: medico,
          datosPersonales: resultado[0].datosPersonalesMedicoQueAtendioConsulta[index],
        }
      })

      //console.log(datosMedicosFinal)
      //console.log('Resultado de la agregación:', resultado);
      return res.status(200).send(
        resultado.map((resultado) => ({
          tipo_documento: resultado.tipo_documento,
          documento: resultado.documento,
          nombre: resultado.nombre,
          apellido: resultado.apellido,
          historia_clinica: resultado.historia_clinica,
          tratamientos_farmacologicos: resultado.tratamientos_farmacologicos,
          consultas: resultado.consultas,
          diagnosticos_tratamiento: resultado.diagnosticos_tratamiento,
          datosPersonalesMedicoQueAtendioConsulta: datosMedicosFinal,
          profesionalQueRecetoTratamiento: resultado.datosPersonalesMedicoQueRecetoTratamientoFarmacologico,
          dosificacionDeCadaTratamiento: resultado.dosificacionesTratamientosFarmacologicos,
          medicamentoDosificado: resultado.medicamentoDosificacion,

        }))
      )
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        error: true,
        mesagge: 'Hubo un error en la elaboracion del informe del paciente.'
      })
    }

  }
}

export default controller;