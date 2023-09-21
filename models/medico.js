import mongoose from 'mongoose'
import persona from "./persona.js"
import especialidad from './especialidad.js'

let esquemaMedico =  new mongoose.Schema({
   legajo: {type:String, required:true},
   matricula: {type:String, required:true},
   titulo: {type:String, required:true},
   fecha_graduacion: {type:Date, required:true},
   especialidad: [{type:mongoose.Schema.Types.ObjectId,ref:"especialidad",required: true}],
   persona: {type:mongoose.Schema.Types.ObjectId,ref:"persona",required: true}
}, {
   collection: 'medico' // Nombre personalizado para la colección
 })

export default mongoose.model('medico', esquemaMedico)