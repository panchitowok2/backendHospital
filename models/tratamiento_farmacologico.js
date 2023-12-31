import mongoose from 'mongoose'
import dosificacion from './dosificacion.js'
import medico from "./medico.js"
import persona from "./persona.js"

// Crear el esquema de la base de datos
let esquemaTratamientoFarmacologico = new mongoose.Schema({
    descripcion: {type: String, required: true},
    fecha_inicio: {type: Date, required: true},
    duracion: {type: String, required: true},
    diagnostico: {type: mongoose.Schema.Types.ObjectId,ref:"diagnostico",  required: true},
    medico: {type: mongoose.Schema.Types.ObjectId, ref:"medico",required: true},
    dosificaciones: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "dosificacion",
          required: true
        }
      ],
}, {
  collection: 'tratamiento_farmacologico' // Nombre personalizado para la colección
})

export default mongoose.model('tratamiento_farmacologico', esquemaTratamientoFarmacologico)