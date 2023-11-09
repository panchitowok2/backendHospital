import mongoose from 'mongoose'
import consulta from './consulta.js'
import enfermedad from './enfermedad.js'

// Crear el esquema de la base de datos
let esquemaDiagnostico = new mongoose.Schema({
    observaciones: { type: String, required: true },
    descripcion: { type: String, required: true },
    consulta: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "consulta",
        required: true 
    },
    enfermedad: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "enfermedad",
        required: true
    }
}, {
    collection: 'diagnostico' // Nombre personalizado para la colección
})

export default mongoose.model('diagnostico', esquemaDiagnostico)