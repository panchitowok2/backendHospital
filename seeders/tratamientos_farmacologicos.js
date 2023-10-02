import mongoose from 'mongoose'
import {url} from '../config.js'
import Medico from '../models/medico.js'
import TratamientoFarmacologico from '../models/tratamiento_farmacologico.js'
import Dosificacion from '../models/dosificacion.js'
import HistoriaClinica from '../models/historia_clinica.js'

mongoose.connect(url).then(async () => {
  console.log('Conexion a la base de datos establecida')

  await TratamientoFarmacologico.deleteMany({});

  const descripciones = [
    "El paciente esta gravemente enfermo",
    "Control de la tiroides",
    "El paciente le duele la garganta",

  ]
    
  const medicos = await Medico.find({})
  const IdMedicos = medicos.map((medico) => medico._id)

  const dosificaciones = await Dosificacion.find({})
  const IdDosificaciones = dosificaciones.map((dosificacion) => dosificacion._id)

  const historias_clinicas = await HistoriaClinica.find({})
  
  for (const historia_clinica of historias_clinicas) {
    const diagnosticos = historia_clinica.diagnosticos

    const descripcionAleatoria = Math.floor(Math.random() * descripciones.length)
    const diagnosticoAleatorio = Math.floor(Math.random() * diagnosticos.length)
    const duracionAleatoria = Math.floor(Math.random() * 60)
    const dosificacionAleatoria = Math.floor(Math.random() * IdDosificaciones.length)

    
    if (diagnosticos.length <= 0)
      continue;

    if (IdDosificaciones.length <= 0)
      continue;

    const medicoAleatorio = Math.floor(Math.random() * IdMedicos.length)

    const nuevoTratamientoFarmacologico = new TratamientoFarmacologico({
      descripcion: descripciones[descripcionAleatoria],
      fecha_inicio: new Date(),
      duracion: duracionAleatoria,
      diagnostico: diagnosticos[diagnosticoAleatorio],
      medico: IdMedicos[medicoAleatorio],
      dosificaciones: IdDosificaciones[dosificacionAleatoria]
    })
    await nuevoTratamientoFarmacologico.save();

    await HistoriaClinica.updateOne(
      { _id: historia_clinica._id },
      { $push: { tratamientos_farmacologicos: nuevoTratamientoFarmacologico._id } }
    );

    IdDosificaciones.splice(dosificacionAleatoria, 1);

    console.log(`Tratamiento Farmacologico "${nuevoTratamientoFarmacologico._id}" insertado.`);
  }

  mongoose.disconnect();
  console.log('Conexión cerrada.');
}).catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});