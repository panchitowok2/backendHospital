import mongoose from 'mongoose'
import { url } from "../config.js"
import Medico from '../models/medico.js';
import { faker} from '@faker-js/faker'
import Turno from "../models/turno.js";
import Consulta from '../models/consulta.js';
import Persona from '../models/persona.js';
import Historia_clinica from '../models/historia_clinica.js';
class FabricaConsultas {
    constructor() {
        this.count = 1;
        this.sintomas = [
            "Fiebre",
            "Tos seca",
            "Dolor de garganta",
            "Dificultad para respirar",
            "Fatiga",
            "Dolor de cabeza",
            "Congestión nasal",
            "Pérdida del olfato o del gusto",
            "Dolor muscular",
            "Náuseas o vómitos",
            "Diarrea",

        ];

        this.observaciones = [
            "Presión arterial dentro de los valores normales.",
            "Historial de alergias a la penicilina.",
            "Nivel de glucosa en sangre elevado.",
            "Paciente se queja de dolor en el pecho.",
            "Pulso irregular detectado.",
            "Reacción adversa a la medicación anterior.",

        ];
    }

    definition(turno) {

        return {
            sintomas:faker.helpers.arrayElement(this.sintomas)+", "+faker.helpers.arrayElement(this.sintomas),
            observacion:faker.helpers.arrayElement(this.observaciones),
            fecha_y_hora:turno.fecha,
            medico:turno.medico,
            turno:turno._id
        };
    }

    create() {
        mongoose.connect(url).then(async () => {
            console.log('Conexion a la base de datos establecida')
            const todos_los_turnos=await Turno.find({})
            

            for (let i = 1; i <= this.count; i++) {
                const turno=todos_los_turnos[i-1];
                const nueva_consulta= new Consulta(this.definition(turno))
                const verificar_consulta= await Consulta.countDocuments({turno:turno._id})
                if (verificar_consulta<1) {
                    await nueva_consulta.save();
                    const paciente= await Persona.findById(turno.persona);
                    await Historia_clinica.updateOne(
                        { _id: paciente.historia_clinica },
                        { $push: { consultas: nueva_consulta._id } } );
                    console.log(`Consulta "${nueva_consulta._id}" insertada.`)
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

export default FabricaConsultas