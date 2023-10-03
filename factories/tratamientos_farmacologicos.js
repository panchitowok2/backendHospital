import mongoose from 'mongoose'
import { url } from "../config.js"
import Persona from '../models/persona.js'
import { faker } from '@faker-js/faker'
import Historia_clinica from '../models/historia_clinica.js';
import Tratamiento_farmacologico from '../models/tratamiento_farmacologico.js';
import Diagnostico from '../models/diagnostico.js';
import Dosificacion from '../models/dosificacion.js';
import Turno from '../models/turno.js';
class FabricaDeTratamientosFarmacologicos {
    constructor() {
        this.count = 1;
        this.descripciones = [
            "El paciente esta gravemente enfermo",
            "Control de la tiroides",
            "El paciente le duele la garganta",
        ]
    }

    definition(diagnostico,dosificacion) {


        return {descripcion:faker.helpers.arrayElement(this.descripciones),
            fecha_inicio:diagnostico.consulta.fecha_y_hora,
            diagnostico:diagnostico._id,
            duracion:faker.helpers.arrayElement(["7 dias","15 dias","21 dias","30 dias","45 dias", "60 dias","75 dias","90 dias"]),
            medico:diagnostico.consulta.medico,
            dosificaciones:dosificacion._id
        };
    }

    create() {
        mongoose.connect(url).then(async () => {
            console.log('Conexion a la base de datos establecida')
            const todos_los_diagnosticos= await Diagnostico.find({}).populate("consulta")
            const todas_las_dosificaciones= await Dosificacion.find({})

            for (let i = 1; i <= this.count; i++) {
                
                const nuevo_tratamiento_farmacologico= new Tratamiento_farmacologico(this.definition(todos_los_diagnosticos[i-1],todas_las_dosificaciones[i-1]))
                const verificar_tratamiento= await Tratamiento_farmacologico.countDocuments({diagnostico:todos_los_diagnosticos[i-1]._id})
                if (verificar_tratamiento<1) {
                    const turno= await Turno.findOne({_id:todos_los_diagnosticos[i-1].consulta.turno})
                    const paciente= await Persona.findOne({_id:turno.persona})
                     await nuevo_tratamiento_farmacologico.save()
                    await Historia_clinica.updateOne(
                        { _id: paciente.historia_clinica },
                        { $push: { tratamientos_farmacologicos: nuevo_tratamiento_farmacologico._id } } );
                    console.log(`tratamiento farmacologico "${nuevo_tratamiento_farmacologico._id}" insertada.`)
                    
                }
            }

            mongoose.disconnect();
            console.log('Conexión cerrada.');
        }).catch(error => {
            console.error('Error al conectar a la base de datos:', error);
        });
    }

    setCount(qty) {
        this.count = qty

        return this
    }
}

export default FabricaDeTratamientosFarmacologicos