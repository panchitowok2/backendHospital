import mongoose from 'mongoose'
import { url } from "../config.js"
import Persona from '../models/persona.js'
import { faker } from '@faker-js/faker'
import Historia_clinica from '../models/historia_clinica.js';
import Consulta from '../models/consulta.js';
import Diagnostico from '../models/diagnostico.js';
import Enfermedad from '../models/enfermedad.js';
import turno from '../models/turno.js';

class FabricaDiagnosticos {
    constructor() {
        this.count = 1;
        this.observaciones = [
            "Paciente presenta fiebre alta.",
            "Presión arterial dentro de los valores normales.",
            "Historial de alergias a la penicilina.",
            "Nivel de glucosa en sangre elevado.",
            "Paciente se queja de dolor en el pecho.",
            "Pulso irregular detectado.",
            "Reacción adversa a la medicación anterior.",

        ];

        this.descripciones = [
            "El paciente presenta fiebre y dolor de garganta.",
            "La paciente se cayó y sufrió una fractura en el brazo derecho.",
            "El paciente se queja de un dolor de cabeza intenso.",

        ];
    }

    definition(consulta, enfermedades) {


        return {
            observaciones: faker.helpers.arrayElement(this.observaciones),
            descripcion: faker.helpers.arrayElement(this, this.descripciones),
            consulta: consulta._id,
            enfermedad: faker.helpers.arrayElement(enfermedades)

        };
    }

    create() {
        mongoose.connect(url).then(async () => {
            console.log('Conexion a la base de datos establecida')
            const todas_las_consultas = await Consulta.find({})
            .populate("turno");
            const aux_enfermedades = await Enfermedad.find({});
            const enfermedades = aux_enfermedades.map((enfermedad) => enfermedad._id)

            for (let i = 1; i <= this.count; i++) {
                const nuevo_diagnostico = new Diagnostico(this.definition(todas_las_consultas[i - 1], enfermedades))
                const verificar_diagnostico = await Diagnostico.countDocuments({ consulta: todas_las_consultas[i - 1]._id })
                if (verificar_diagnostico < 1) {
                    
                    await nuevo_diagnostico.save()
                    await Historia_clinica.updateOne(
                        { consultas:nuevo_diagnostico.consulta },
                        { $push: { diagnosticos: nuevo_diagnostico._id } });
                    console.log(`diagnostico "${nuevo_diagnostico._id}" insertada.`)
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

export default FabricaDiagnosticos