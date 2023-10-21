import mongoose from 'mongoose'
import { url } from '../config.js'
import { faker } from '@faker-js/faker'
import Persona from '../models/persona.js'
import Medico from '../models/medico.js'
import Turno from '../models/turno.js'

class fabricarTurnos {
    constructor() {
        this.count = 1;
        this.medicos = [];
        this.personas = [];

    }
    definition() {
        return {
            fecha: faker.date.between({ from: '2016-01-01T00:00:00.000Z', to: '2023-01-01T00:00:00.000Z' }),
            hora: faker.helpers.arrayElement(['10:30', '11:00', '12:00', '12:30', '13:00', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00']),
            medico: faker.helpers.arrayElement(this.medicos),
            persona: faker.helpers.arrayElement(this.personas)

        }
    }

    create() {
        mongoose.connect(url).then(async () => {
            console.log('Conexion a la base de datos establecida')

            const medicosAux = await Medico.find({})
            this.medicos = medicosAux.map((medico) => medico._id);
            const personasAux = await Persona.find({ historia_clinica: { $ne: null } })
            this.personas = personasAux.map((persona) => persona._id);
            let cont = 0
            while (cont <= this.count) {
                const nuevo_Turno = new Turno(this.definition())
                const turno_valido = await Turno.countDocuments({
                    fecha: nuevo_Turno.fecha,
                    medico: nuevo_Turno.medico,
                    persona: nuevo_Turno.persona,
                    hora: nuevo_Turno.hora
                })
                if (turno_valido < 1) {
                    await nuevo_Turno.save();
                    console.log(`Turno "${nuevo_Turno._id}" insertado.`);
                    cont++;

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
export default fabricarTurnos