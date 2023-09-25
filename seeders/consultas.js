import mongoose from 'mongoose'
import {url} from '../config.js'
import Consulta from '../models/consulta.js'
import Medico from '../models/medico.js'
import Turno from '../models/turno.js'
import HistoriaClinica from '../models/historia_clinica.js'
import Persona from '../models/persona.js'

mongoose.connect(url).then(async () => {
  console.log('Conexion a la base de datos establecida')

  const sintomas = [
    "Fiebre",
    "Tos seca",
    "Dolor de garganta",
    "Dificultad para respirar",
    "Fatiga",
    "Dolor de cabeza",
    "Congestión nasal",
    "Pérdida del olfato o del gusto",
    "Dolor muscular",
    "Náuseas o vómitos",
    "Diarrea",

  ];

  const observaciones = [
    "Paciente presenta fiebre alta.",
    "Presión arterial dentro de los valores normales.",
    "Historial de alergias a la penicilina.",
    "Nivel de glucosa en sangre elevado.",
    "Paciente se queja de dolor en el pecho.",
    "Pulso irregular detectado.",
    "Reacción adversa a la medicación anterior.",
    
  ];
    
  const medicos = await Medico.find({})
  const IdMedicos = medicos.map((medico) => medico._id);

  const turnos = await Turno.find({})

  const personas = await Persona.find({})
  
  for (const turno of turnos) {
    const persona = await Persona.findOne({_id: turno.persona})

    if (persona == null || persona.historia_clinica == null) {
      console.log('Persona sin historia clinica')
      continue;
    }


    const medicoAleatorio = Math.floor(Math.random() * IdMedicos.length)
    const sintomaAleatorio = Math.floor(Math.random() * sintomas.length)
    const observacionAleatoria = Math.floor(Math.random() * observaciones.length)

    const historia_clinica = await HistoriaClinica.findOne({ _id: persona.historia_clinica })
    console.log('Historia clinica encontrada' +historia_clinica._id)
    
    const nuevaConsulta = new Consulta({
      sintomas: sintomas[sintomaAleatorio],
      observaciones: observaciones[observacionAleatoria],
      fecha_y_hora: new Date(),
      medico: IdMedicos[medicoAleatorio],
      turno: turno._id
    })
    await nuevaConsulta.save();

    await HistoriaClinica.updateOne(
      { _id: historia_clinica._id },
      { $push: { consultas: nuevaConsulta._id } }
    );

    console.log(`Consulta "${nuevaConsulta._id}" insertada.`);
  }

  mongoose.disconnect();
  console.log('Conexión cerrada.');
}).catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});