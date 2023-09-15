import mongoose from 'mongoose'

let esquemaMedicamento=  new mongoose.Schema({
    droga: {type:String, required:true},
    nombre: {type:String, required:true},
    presentacion: {type: String, required: true}
})

export default mongoose.model('medicamento', esquemaMedicamento)