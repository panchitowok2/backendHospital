import historia_clinica from '../models/historia_clinica.js';
import persona from '../models/persona.js'
import mongoose from 'mongoose';
import functions from './functions/functions_personas.js'
import tratamiento_farmacologico from '../models/tratamiento_farmacologico.js';

var controller = {
  //buscar id historia clinica segun datos de paciente
  buscarIdHistoriaClinica: async (req, res) => {
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
        id: historiaClinicaBuscada._id,
      })
    }).catch(error => {
      return res.status(500).send({
        error: true,
        message: 'No ha sido posible buscar la historia clinica' + error
      })
    })
  },
  //Buscar datos de historia clinica segun un id
  buscarDatosHistoriaClinica: async (req, res) => {
    var params = req.body

    await historia_clinica.findOne({
      _id: params._id
    }).then(historiaClinicaBuscada => {
      //si la historia clinica no pude ser encontrada devuelve este error    
      if (!historiaClinicaBuscada) {
        return res.status(404).send({
          error: true,
          message: 'No existe la historia clinica'
        })
      }
      //si la historia clinica fue encontrada devolvemos esto
      return res.status(200).send(historiaClinicaBuscada)
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

      var personaBuscada = await functions.buscarPersonaPorId(params)
      if (!personaBuscada) {
        await session.abortTransaction();
        return res.status(404).send({
          error: true,
          message: 'NOT FOUND: La persona no existe en el sistema'
        })
      }

      if (personaBuscada.historia_clinica) {
        await session.abortTransaction();
        return res.status(403).send({
          error: true,
          message: 'FORBIDDEN: La persona ya tiene historia clinica'
        })
      } else {

        const historicasClinicas = await historia_clinica.create([params], { session: session });
        hist_clinica = historicasClinicas[0];
        const histID = hist_clinica._id;

        //asigno historia clinica a persona
        await persona.updateOne(
          {
            _id: params._id,
          },
          { historia_clinica: histID },
          { session: session });
        //termino la transaccion 
        await session.commitTransaction();
        console.log("Historia clinica creada y guardada con exito.")
      }
    } catch (err) {
      await session.abortTransaction();
      return res.status(500).send({
        error: true,
        status: 'error',
        message: 'Ha ocurrido un error en el servidor.'
      });
    }
    session.endSession();

    return res.status(200).send({
      status: 'Sucess'
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
    var resultado = []
    var datosTratamiento = {};
    try {
      resultado = await persona.aggregate([
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
            from: "medico",
            localField: "consultas.medico",
            foreignField: "_id",
            as: "medicos"
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
            "consultas._id": 0,
            "consultas.medico": 0,
            "consultas.turno": 0,
            "consultas.__v": 0,
            "medicos._id": 0,
            "medicos.especialidades": 0,
            "medicos.persona": 0,
            "medicos.__v": 0,
          }
        }
      ])
      //console.log('Los tratamientos farmacologicos: ', resultado[0].tratamientos_farmacologicos)

      //console.log(datosMedicosFinal)
      //console.log('Resultado de la agregación:', resultado);

    } catch (error) {
      console.log(error)
      return res.status(500).send({
        error: true,
        mesagge: 'Hubo un error en la elaboracion del informe del paciente.'
      })
    }

    try {
      for (let tratamiento of resultado[0].tratamientos_farmacologicos) {
        let iteracion = await tratamiento_farmacologico.aggregate([
          {
            $match: {
              _id: new mongoose.Types.ObjectId(tratamiento._id)
            }
          },
          {
            $lookup: {
              from: "dosificacion",
              localField: "dosificaciones",
              foreignField: "_id",
              as: "dosificacionesTratamiento"
            }
          },
          {
            $lookup: {
              from: "medicamento",
              localField: "dosificacionesTratamiento.medicamento",
              foreignField: "_id",
              as: "medicamentoDosificaciones"
            }
          },
          {
            $lookup: {
              from: "medico",
              localField: "medico",
              foreignField: "_id",
              as: "medicoRecetoTratamiento"
            }
          },
          {
            $lookup: {
              from: "diagnostico",
              localField: "diagnostico",
              foreignField: "_id",
              as: "diagnosticoTratamiento"
            }
          },
          {
            $project: {
              _id: 0,
              diagnostico: 0,
              dosificaciones: 0,
              medico: 0,
              __v: 0,              
            "dosificacionesTratamiento._id": 0,
            "dosificacionesTratamiento.medicamento": 0,
            "dosificacionesTratamiento.__v": 0,
            "medicamentoDosificaciones._id": 0,
            "medicamentoDosificaciones.__v": 0,
            "medicoRecetoTratamiento._id": 0,
            "medicoRecetoTratamiento.especialidades": 0,
            "medicoRecetoTratamiento.persona": 0,
            "medicoRecetoTratamiento.__v": 0,
            "diagnosticoTratamiento._id": 0,
            "diagnosticoTratamiento.consulta": 0,
            "diagnosticoTratamiento.enfermedad": 0,
            "diagnosticoTratamiento.__v": 0,
            }
          }
        ])
        datosTratamiento[tratamiento.descripcion] = iteracion;
      }
    } catch (error) {
      console.log(error)
      return res.status(500).send({
        error: true,
        mesagge: 'Hubo un error con los tratamientos farmacológicos.'
      })
    }

    return res.status(200).send(
      resultado.map((resultado) => ({
        datosTratamientos: datosTratamiento,
        historia_clinica: resultado.historia_clinica,
        consultas: resultado.consultas,
        medicoQueAtendioConsulta: resultado.medicos,
      }))
    )
  },
  obtenerDiagnosticos: async (req, res) => {
    var params = req.params;
    const idHistoriaClinica = new mongoose.Types.ObjectId(params.id);

    try {
      const diagnosticos = await historia_clinica.aggregate([
        {
          $match: {
            _id: idHistoriaClinica // Match con el ID de historia clínica
          }
        },
        {
          $lookup: {
            from: 'diagnostico',
            localField: 'diagnosticos',
            foreignField: '_id',
            as: 'diagnostico'
          }
        },
        {
          $unwind: "$diagnostico"
        },
        {
          $lookup: {
            from: 'enfermedad',
            localField: 'diagnostico.enfermedad',
            foreignField: '_id',
            as: 'enfermedad'
          }
        }
      ])

      if (diagnosticos.length === 0)
        return res.status(404).send({ message: "No existen diagnosticos en la Historia Clínica" })

      // formateamos la salida
      const resultado = diagnosticos.map(item => ({
        "_id": item.diagnostico._id,
        "observaciones": item.diagnostico.observaciones,
        "descripcion": item.diagnostico.descripcion,
        "consulta": item.diagnostico.consulta,
        "enfermedad": item.enfermedad[0],
      }))

      return res.status(200).send(resultado)
    } catch (err) {
      return res.status(500).send({
        error: true,
        status: 'error',
        message: 'Ha ocurrido un error en el servidor.'
      });
    }
  }
}

export default controller;