import mongoose from 'mongoose'
import {url} from '../config.js'
import Enfermedad from '../models/enfermedad.js'
import HistoriaClinica from '../models/historia_clinica.js'
import Diagnostico from '../models/diagnostico.js'


mongoose.connect(url).then(async () => {
  console.log('Conexion a la base de datos establecida')

  const observaciones = [
    "Paciente presenta fiebre alta.",
    "Presión arterial dentro de los valores normales.",
    "Historial de alergias a la penicilina.",
    "Nivel de glucosa en sangre elevado.",
    "Paciente se queja de dolor en el pecho.",
    "Pulso irregular detectado.",
    "Reacción adversa a la medicación anterior.",
    
  ];

  const descripciones = [
    "El paciente presenta fiebre y dolor de garganta.",
    "La paciente se cayó y sufrió una fractura en el brazo derecho.",
    "El paciente se queja de un dolor de cabeza intenso.",

  ];

  const enfermedades = await Enfermedad.find({})
  const IdEnfermedades = enfermedades.map((enfermedad) => enfermedad._id);
    
  const historias_clinicas = await HistoriaClinica.find({})

  for (const historia_clinica of historias_clinicas) {
    for (const consulta of historia_clinica.consultas) {
      const observacionAleatoria = Math.floor(Math.random() * observaciones.length)
      const descripcionAleatoria = Math.floor(Math.random() * descripciones.length)
      const enfermedadAleatoria = Math.floor(Math.random() * enfermedades.length)

      const nuevoDiagnostico = new Diagnostico({
        observaciones: observaciones[observacionAleatoria],
        descripcion: descripciones[descripcionAleatoria],
        consulta: consulta._id,
        enfermedad: IdEnfermedades[enfermedadAleatoria]
      })

      await nuevoDiagnostico.save();

      await HistoriaClinica.updateOne(
        { _id: historia_clinica._id },
        { $push: { diagnosticos: nuevoDiagnostico._id } }
      );

      console.log(`Diagnostico "${nuevoDiagnostico._id}" insertado.`);
    }
  }

  mongoose.disconnect();
  console.log('Conexión cerrada.');
}).catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});