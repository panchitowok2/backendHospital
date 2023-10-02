import mongoose from 'mongoose'
import {url} from '../config.js'
import Persona from '../models/persona.js'
import Medico from '../models/medico.js'
import Turno from '../models/turno.js'

function horaAleatoria() {
  const hora = Math.floor(Math.random() * 24); // Número aleatorio entre 0 y 23 para las horas
  const minutos = Math.floor(Math.random() * 60); // Número aleatorio entre 0 y 59 para los minutos

  // Formatear la hora y los minutos para que tengan dos dígitos
  const horaFormateada = hora < 10 ? `0${hora}` : hora.toString();
  const minutosFormateados = minutos < 10 ? `0${minutos}` : minutos.toString();

  // Combinar la hora y los minutos en el formato "hh:mm"
  return `${horaFormateada}:${minutosFormateados}`;
}

mongoose.connect(url).then(async () => {
  console.log('Conexion a la base de datos establecida')
  await Turno.deleteMany({});
    
  const medicos = await Medico.find({})
  const IdMedicos = medicos.map((medico) => medico._id);

  const personas = await Persona.find({})
  
  for (const persona of personas) {
    const medicoAleatorio = Math.floor(Math.random() * IdMedicos.length)

    const nuevoTurno = new Turno({
      fecha: new Date(),
      hora: horaAleatoria(),
      persona: persona._id,
      medico: IdMedicos[medicoAleatorio]
    })
    await nuevoTurno.save();

    console.log(`Turno "${nuevoTurno._id}" insertado.`);
  }

  mongoose.disconnect();
  console.log('Conexión cerrada.');
}).catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});