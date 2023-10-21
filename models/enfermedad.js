import mongoose from 'mongoose'

// Crear el esquema de la base de datos
let esquemaEnfermedad = new mongoose.Schema({
    nombre: {type: String, required: true},
    tipo: {type: String, required: true}
}, {
  collection: 'enfermedad' // Nombre personalizado para la colección
})

export default mongoose.model('enfermedad', esquemaEnfermedad)