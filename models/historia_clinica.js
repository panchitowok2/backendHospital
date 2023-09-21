import mongoose from 'mongoose'
import tratamiento_farmacologico from './tratamiento_farmacologico.js'
import consultas from './consulta.js'
import diagnosticos from './diagnostico.js'

let esquemaHistoriaClinica = new mongoose.Schema({
    grupo_sanguineo: {type: String, required: true},
    factor_sanguineo: {type: String, required: true},
    tratamiento_farmacologico: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "tratamiento_farmacologico",
          default: [] // nombre del modelo al que se hace referencia
        }
      ],
    consultas: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "consultas",
          default: [] // nombre del modelo al que se hace referencia
        }
      ],
    diagnosticos: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "diagnosticos",
          default: [] // nombre del modelo al que se hace referencia
        }
      ]
}, {
  collection: 'historia_clinica' // Nombre personalizado para la colección
})

export default mongoose.model('historia_clinica', esquemaHistoriaClinica)