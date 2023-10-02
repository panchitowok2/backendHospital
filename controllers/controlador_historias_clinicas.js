import historia_clinica from '../models/historia_clinica.js';
import persona from '../models/persona.js'
import mongoose from 'mongoose';

var controller = {
    //buscar historia clinica segun datos de paciente
    buscarHistoriaClinica: async (req, res) => {
        var params = req.body

        var personaBuscada = await persona.findOne({
            documento: params.documento,
            tipo_documento: params.tipo_documento,
            apellido: params.apellido,
            sexo: params.sexo
        })
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
          //si la persona fue encontrada devolvemos esto
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
    altaHistoriaClinica: async (req,res) => {
        var params = req.body;
        const session = await mongoose.startSession();
        var hist_clinica = null;

        try{
            //inicio la transaccion
            session.startTransaction();

            const historicasClinicas = await historia_clinica.create([params], {session: session});
            hist_clinica = historicasClinicas[0];
            const histID = hist_clinica._id;
            console.log("La nueva historia clìnica es: "+ histID);

            //asigno historia clinica a persona
            await persona.updateOne(
                {documento: params.documento,
                tipo_documento: params.tipo_documento,
                sexo: params.sexo,
                apellido: params.apellido},
                {historia_clinica: histID},
                {session: session});
            //termino la transaccion 
            await session.commitTransaction();
            console.log("Historia clinica creada y guardada con exito :D")
        }catch(err){
            await session.abortTransaction();
            console.error("Error en la operacion: "+err);
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
    Este metodo verifica si un paciente existe, y luego retorna
    de persona muestro nombren apellido sexo y dni
    de su historia clinica su grupo_sanguineo y factor_sanguineo
    de las consultas sus sintomas, y fecha
    de los tratamientos su tipo y fecha de inicio
    de los diagnosticos sus observaciones
    medico de cada consulta (nombre y especialidad)
    de la dosificacion de cada tratamiento su dosis y droga
    
    */
    elaborarInformePaciente: async (req, res)=>{
        var params = req.body

        //buscamos la persona, y si no existe retornamos un error
        var personaBuscada = await persona.findOne({
            documento: params.documento,
            tipo_documento: params.tipo_documento,
            apellido: params.apellido,
            sexo: params.sexo
        })
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
          //si la persona fue encontrada devolvemos esto
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
    }
}

export default controller;