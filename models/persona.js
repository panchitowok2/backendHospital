import mongoose from 'mongoose'
import validator from 'validator'

import historia_clinica from './historia_clinica.js'

let esquemaPersona = new mongoose.Schema({
    tipo_documento:{type:String, required:true, enum:['DNI','LC', 'LE']},
    documento: {type: Number, required: true},
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    telefono: {type: Number, required: false},
    email: {
      type: String,
      required: false,
      //unique: true,
      lowercase: true,
      validate: (value) => {
        return validator.isEmail(value)
      }
    },
    nacionalidad: {type: String, required: true},
    fecha_nacimiento: {type: Date, required: true},
    direccion: {type: String, required: false},
    historia_clinica:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"historia_clinica",
      required: false,
      default: null,
    },
    sexo: {
      type: String,
      required: true,
      validate: {
        validator: function(value) {
          return ['M', 'F', 'X'].includes(value);
        },
        message: 'El campo sexo debe ser "M" o "F"'
      }
    }
}, {
  collection: 'persona' // Nombre personalizado para la colección
})

esquemaPersona.index({tipo_documento: 1, documento: 1, apellido: 1, sexo: 1}, {unique: true});
  
export default mongoose.model('persona', esquemaPersona)
