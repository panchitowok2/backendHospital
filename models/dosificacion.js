import mongoose from 'mongoose'
import medicamento from './medicamento.js'

// Crear el esquema de la base de datos
let esquemaDosificacion = new mongoose.Schema({
    dosis: {type: String, required: true},
    medicamento: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "medicamento",
        required: true
    }
}, {
    collection: 'dosificacion' // Nombre personalizado para la colección
})

export default mongoose.model('dosificacion', esquemaDosificacion)