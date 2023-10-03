import mongoose from 'mongoose'
import { url } from "../config.js"
import Persona from '../models/persona.js'
import { faker } from '@faker-js/faker'
import HistoriaClinica from '../models/historia_clinica.js';
import Enfermedad from '../models/enfermedad.js';

class FabricaDeEnfermedades {
    constructor() {
        this.count = 1;
    }


    create() {
        mongoose.connect(url).then(async () => {
            console.log('Conexion a la base de datos establecida')

            const enfermedades = [
                { nombre: "Gripe", tipo: "Viral" },
                { nombre: "Diabetes tipo 2", tipo: "Metabólica" },
                { nombre: "Hipertensión arterial", tipo: "Cardiovascular" },
                { nombre: "Asma", tipo: "Respiratoria" },
                { nombre: "Artritis reumatoide", tipo: "Autoinmune" },
                { nombre: "Cáncer de pulmón", tipo: "Oncológica" },
                { nombre: "Enfermedad de Alzheimer", tipo: "Neurológica" },
                { nombre: "EPOC (Enfermedad Pulmonar Obstructiva Crónica)", tipo: "Respiratoria" },
                { nombre: "Anemia ferropénica", tipo: "Hematológica" }
            ];

            for (const enfermedad of enfermedades) {
                const nuevaEnfermedad = new Enfermedad(enfermedad);
                await nuevaEnfermedad.save();

                console.log(`Enfermedad "${enfermedad.nombre}" insertada.`);
            }
            mongoose.disconnect();
            console.log('Conexión cerrada.');
        }).catch(error => {
            console.error('Error al conectar a la base de datos:', error);
        });
    }

}

export default FabricaDeEnfermedades