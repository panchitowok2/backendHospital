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
            as: "historia_clinica2"
          }
        },
        {
          $lookup: {
            from: "tratamiento_farmacologico",
            localField: "historia_clinica2.tratamientos_farmacologicos",
            foreignField: "_id",
            as: "tratamientos_farmacologicos2"
          }
        },
                
        {
          $lookup: {
            from: "consulta",
            localField: "historia_clinica2.consultas",
            foreignField: "_id",
            as: "consultas"
          }
        },
        
        {
          $lookup: {
            from: "diagnostico",
            localField: "tratamientos_farmacologicos2.diagnostico",
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
            localField: "tratamientos_farmacologicos2.medico",
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
            localField: "tratamientos_farmacologicos2.dosificaciones",
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
            "historia_clinica2._id": 0,
            "historia_clinica2.tratamientos_farmacologicos": 0,
            "historia_clinica2.consultas": 0,
            "historia_clinica2.diagnosticos": 0,
            "historia_clinica2.__v": 0,
          }
        }
      ])

      //console.log('Resultado de la agregación:', resultado);
      return res.status(200).send({
        resultado
      })
    } catch (error) {
      return res.status(500).send({
        error: true,
        mesagge: 'Hubo un error en la elaboracion del informe del paciente.'
      })
    }

  }

  /*
   elaborarInformePaciente: async (req, res) => {
     var params = req.body
 
     //Precondicion para este metodo: La persona existe en el sistema
     //verifico que la historia clinica existe en la coleccion de Historias Clinicas
     var personaBuscada = await functions.buscarPersona(params)
     //console.log(personaBuscada)
 
     if (!personaBuscada) {
       return res.status(500).send({
         error: true,
         message: 'La persona no existe en el sistema'
       })
     }
     await historia_clinica.findOne({
       _id: personaBuscada.historia_clinica
     }).then(async historiaClinicaBuscada => {
       //si la historia clinica no pude ser encontrada devuelve este error
       if (!historiaClinicaBuscada) {
         return res.status(404).send({
           error: true,
           message: 'No existe la historia clinica'
         })
       }
       //buscamos los datos de las consultas, y los medicos de cada consulta
       if (historiaClinicaBuscada.consultas.length > 0) {
         var datosConsulta = {};
         var datosMedicos = {};
         var numeroConsulta = null;
         var numeroMedico = null;
         var datosUnaConsulta = {};
         var datosUnMedico = {};
         for (let i = 0; i < historiaClinicaBuscada.consultas.length; i++) {
           numeroConsulta = `Consulta${i}`
           numeroMedico = `Medico${i}`
           datosUnaConsulta = await functionsConsulta.buscarConsulta(historiaClinicaBuscada.consultas[i]);
           datosUnMedico = await functionsMedico.buscarMedico(datosUnaConsulta.medico);
           datosMedicos[numeroMedico] = datosUnMedico;
           datosConsulta[numeroConsulta] = datosUnaConsulta;
         }
       }
       //buscamos los datos de tratamientos farmacologicos, y sus diagnosticos asociados
       if (historiaClinicaBuscada.tratamientos_farmacologicos.length > 0) {
         var datosTratamientos = {};
         var datosDiagnosticos = {};
         var datosMedicosTratamiento = {};
         var datosDosificaciones = {};
         var datosDosificacionesPorTratamiento = {};
         var numeroTratamiento = null;
         var numeroDiagnostico = null;
         var numeroDosificacion = null;
         var datosUnTratamiento = {};
         var datosUnDiagnostico = {};
         var datosUnaDosificacion = {};
         for (let i = 0; i < historiaClinicaBuscada.tratamientos_farmacologicos.length; i++) {
           numeroTratamiento = `TratamientoFarmacologico${i}`
           numeroDiagnostico = `Diagnostico${i}`
           numeroMedico = `Medico${i}`;
           numeroDosificacion = `Dosificacion${i}`
           datosUnTratamiento = await functionsTratamiento.buscarTratamientoFarmacologico(historiaClinicaBuscada.tratamientos_farmacologicos[i]);
           datosUnDiagnostico = await functionsDiagnostico.buscarDiagnostico(datosUnTratamiento.diagnostico);
           datosUnMedico = await functionsMedico.buscarMedico(datosUnTratamiento.medico);
           for (let j = 0; j < datosUnTratamiento.dosificaciones.length; j++) {
             datosUnaDosificacion = await functionsDosificacion.buscarDosificacion(datosUnTratamiento.dosificaciones[j]);
             datosDosificacionesPorTratamiento[`Dosificacion${j}`] = datosUnaDosificacion;
           }
           datosDiagnosticos[numeroDiagnostico] = datosUnDiagnostico;
           datosTratamientos[numeroTratamiento] = datosUnTratamiento;
           datosMedicosTratamiento[numeroMedico] = datosUnMedico;
           datosDosificaciones[`DosificacionesDeTratamiento${i}`] = datosDosificacionesPorTratamiento;
         }
       }
 
       //si la persona fue encontrada devolvemos esto
       return res.status(200).send({
         grupo_sanguineo: historiaClinicaBuscada.grupo_sanguineo,
         factor_sanguineo: historiaClinicaBuscada.factor_sanguineo,
         tratamientos_farmacologicos: historiaClinicaBuscada.tratamientos_farmacologicos,
         consultas: historiaClinicaBuscada.consultas,
         diagnosticos: historiaClinicaBuscada.diagnosticos,
         datosDeConsultasDelPaciente: datosConsulta,
         datosTratamientosDelPaciente: datosTratamientos,
         datosDeDiagnosticosDeLosTratamientos: datosDiagnosticos,
         datosDeMedicosQueAtendieronLasConsultas: datosMedicos,
         datosDeMedicosQueIndicaronElTratamiento: datosMedicosTratamiento,
         datosDosificacionesPorTratamiento: datosDosificaciones
       })
     }).catch(error => {
       return res.status(500).send({
         error: true,
         message: 'No ha sido posible buscar la historia clinica' + error
       })
     })
 
   }
   */
}

export default controller;