import mongoose from 'mongoose'
import {url} from '../config.js'
import Persona from '../models/persona.js'

mongoose.connect(url).then(async () => {
  console.log('Conexion a la base de datos establecida')
    
  const personas = [
    {
        tipo_documento: "DNI",
        documento: 12345678,
        nombre: "Juan",
        apellido: "Pérez",
        telefono: 987654321,
        email: "juan@example.com",
        nacionalidad: "Argentina",
        fecha_nacimiento: "1990-05-15",
        direccion: "Calle 123",
        historia_clinica: null,
        sexo: "M"
    },
    {
        tipo_documento: "Pasaporte",
        documento: 87654321,
        nombre: "María",
        apellido: "Gómez",
        telefono: 999888777,
        email: "maria@example.com",
        nacionalidad: "España",
        fecha_nacimiento: "1985-12-10",
        direccion: "Avenida Principal",
        historia_clinica: null,
        sexo: "F"
    },
    
  ];

  for (const persona of personas) {
    const nuevaPersona = new Persona(persona);
    await nuevaPersona.save();
    
    console.log(`Persona "${persona.nombre} ${persona.apellido}" insertada.`);
  }

  mongoose.disconnect();
  console.log('Conexión cerrada.');
}).catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});