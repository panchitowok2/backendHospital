import mongoose from 'mongoose'
import { url } from "../config.js"
import Persona from '../models/persona.js'
import { faker } from '@faker-js/faker'
import HistoriaClinica from '../models/historia_clinica.js';
import Dosificacion from '../models/dosificacion.js';
import Medicamento from '../models/medicamento.js';

class FabricaDeDosificaciones {
    constructor() {
        this.count = 1;
    }


    create() {
        mongoose.connect(url).then(async () => {
            console.log('Conexion a la base de datos establecida')
            const dosis = [
                "cada 8 hrs",
                "cada 12 hrs",
                "una vez al día",
                "dos veces al día",
                "tres veces al día",
                "antes de cada comida",
                "antes de acostarse",
                "según sea necesario",

            ];

            const medicamentos = await Medicamento.find({})
            for (let index = 0; index < this.count; index++) {
                const dosisAleatoria = Math.floor(Math.random() * dosis.length)
                const medicamentoAleatorio = Math.floor(Math.random() * medicamentos.length)
                const nuevaDosificacion = new Dosificacion({
                    dosis: dosis[(dosisAleatoria)],
                    medicamento: medicamentos[medicamentoAleatorio]._id
                })
                await nuevaDosificacion.save()

                console.log(`Dosificacion "${nuevaDosificacion.dosis}" insertada.`)
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

export default FabricaDeDosificaciones