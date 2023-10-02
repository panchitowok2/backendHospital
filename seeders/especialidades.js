import mongoose from 'mongoose'
import {url} from '../config.js'
import Especialidad from '../models/especialidad.js'

mongoose.connect(url).then(async () => {
  console.log('Conexion a la base de datos establecida')
  await Especialidad.deleteMany({});
  const especialidadesMedicas = [
    { nombre: "Cardiología" },
    { nombre: "Dermatología" },
    { nombre: "Gastroenterología" },
    { nombre: "Neurología" },
    { nombre: "Pediatría" },
    { nombre: "Oftalmología" },
    { nombre: "Oncología" },
    { nombre: "Ortopedia" },
    { nombre: "Psiquiatría" },
    { nombre: "Radiología" }
];

  for (const especialidadesMedica of especialidadesMedicas) {
    const nuevaEspecialidadMedica = new Especialidad(especialidadesMedica);
    await nuevaEspecialidadMedica.save();
    
    console.log(`Especialidad "${especialidadesMedica.nombre}" insertada.`);
  }

  mongoose.disconnect();
  console.log('Conexión cerrada.');
}).catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});