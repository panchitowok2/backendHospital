import mongoose from 'mongoose'
import { url } from "../config.js"
import Persona from '../models/persona.js'
import { faker } from '@faker-js/faker'
import HistoriaClinica from '../models/historia_clinica.js';
import Especialidad from '../models/especialidad.js';

class FabricaDeEspecialidades {
    constructor() {
        this.count = 1;
    }


    create() {
        mongoose.connect(url).then(async () => {
            console.log('Conexion a la base de datos establecida')
            const especialidadesMedicas = [
                { nombre: "Cardiología" },
                { nombre: "Dermatología" },
                { nombre: "Gastroenterología" },
                { nombre: "Neurología" },
                { nombre: "Pediatría" },
                { nombre: "Oftalmología" },
                { nombre: "Oncología" },
                { nombre: "Ortopedia" },
                { nombre: "Psiquiatría" },
                { nombre: "Radiología" }
            ];

            for (const especialidadesMedica of especialidadesMedicas) {
                const nuevaEspecialidadMedica = new Especialidad(especialidadesMedica);
                await nuevaEspecialidadMedica.save();

                console.log(`Especialidad "${especialidadesMedica.nombre}" insertada.`);
            }
            mongoose.disconnect();
            console.log('Conexión cerrada.');
        }).catch(error => {
            console.error('Error al conectar a la base de datos:', error);
        });
    }

}

export default FabricaDeEspecialidades