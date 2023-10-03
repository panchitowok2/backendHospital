import mongoose from 'mongoose'
var Schema = mongoose.Schema
import medico from "./medico.js"
import persona from "./persona.js"

// Crear el esquema de la base de datos
let esquemaTurno = new Schema({
    fecha: Date,
    hora: String,
    medico: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'medico',
        required: true
    },
    persona: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'persona',
        required: true
    }
}, {
    collection: 'turno' // Nombre personalizado para la colección
})

export default mongoose.model('turno', esquemaTurno)