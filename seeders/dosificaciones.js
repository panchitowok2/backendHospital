import mongoose from 'mongoose'
import {url} from '../config.js'
import Medicamento from '../models/medicamento.js'
import Dosificacion from '../models/dosificacion.js'

mongoose.connect(url).then(async () => {
  console.log('Conexion a la base de datos establecida')

  const dosis = [
    "cada 8 hrs",
    "cada 12 hrs",
    "una vez al día",
    "dos veces al día",
    "tres veces al día",
    "antes de cada comida",
    "antes de acostarse",
    "según sea necesario",

  ];

  const medicamentos = await Medicamento.find({})
    
  for (const medicamento of medicamentos) {
    const dosisAleatoria = Math.floor(Math.random() * dosis.length)

    const nuevaDosificacion = new Dosificacion({
      dosis: dosis[dosisAleatoria],
      medicamento: medicamento._id
    })
    await nuevaDosificacion.save()
    
    console.log(`Dosificacion "${nuevaDosificacion.dosis}" insertada.`)
  }

  mongoose.disconnect();
  console.log('Conexión cerrada.');
}).catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});