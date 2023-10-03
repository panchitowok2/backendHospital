import mongoose from 'mongoose'
import validator from 'validator'

import historia_clinica from './historia_clinica.js'

let esquemaPersona = new mongoose.Schema({
  tipo_documento: { type: String, required: true },
  documento: { type: Number, required: true },
  nombre: { type: String, required: true },
  apellido: { type: String, required: true },
  telefono: { type: Number, required: false },
  email: {
    type: String,
    required: false,
    //unique: true,
    lowercase: true,
    validate: (value) => {
      return validator.isEmail(value)
    }
  },
  nacionalidad: { type: String, required: true },
  fecha_nacimiento: { type: Date, required: true },
  direccion: { type: String, required: false },
  historia_clinica: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "historia_clinica",
    required: false
  },
  sexo: { type: String, required: true }
}, {
  collection: 'persona' // Nombre personalizado para la colección
})

export default mongoose.model('persona', esquemaPersona)