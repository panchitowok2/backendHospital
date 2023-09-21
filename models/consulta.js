import mongoose from 'mongoose'
import turno from './turno.js'
import medico from './medico.js'

let esquemaConsulta =  new mongoose.Schema({
    sintomas:{type:String, required:true},
    observacion:String,
    fecha_y_hora:{type:Date, required:true},
    medico:{type:mongoose.Schema.Types.ObjectId,ref:"medico",required: true},
    turno:{type:mongoose.Schema.Types.ObjectId,ref:"turno",required: false}
}, {
    collection: 'consulta' // Nombre personalizado para la colección
  })

export default mongoose.model('consulta', esquemaConsulta)