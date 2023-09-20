import mongoose from 'mongoose'

// Crear el esquema de la base de datos
let esquemaEspecialidad = new mongoose.Schema({
  nombre: {type: String, required: true}
}, {
  collection: 'especialidad' // Nombre personalizado para la colección
})

export default mongoose.model('especialidad', esquemaEspecialidad)