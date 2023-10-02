import mongoose from 'mongoose'
import {url} from '../config.js'
import Persona from '../models/persona.js'
import HistoriaClinica from '../models/historia_clinica.js'

mongoose.connect(url).then(async () => {
  console.log('Conexion a la base de datos establecida')
    
  await Persona.deleteMany({});
  await HistoriaClinica.deleteMany({});

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
        tipo_documento: "DNI",
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

  const gruposSanguineos = ["A", "B", "AB", "O"];
  const factores_sanguineos = ["+", "-"];

  for (const persona of personas) {
    const grupoAleatorio = Math.floor(Math.random() * gruposSanguineos.length);
    const factorAleatorio = Math.floor(Math.random() * factores_sanguineos.length);

    const nuevaHistoriaClinica = new HistoriaClinica({
      grupo_sanguineo: gruposSanguineos[grupoAleatorio],
      factor_sanguineo: factores_sanguineos[factorAleatorio]
    })
    await nuevaHistoriaClinica.save();

    persona.historia_clinica = nuevaHistoriaClinica._id

    const nuevaPersona = new Persona(persona);
    await nuevaPersona.save();

    console.log(`Persona "${persona.nombre} ${persona.apellido}" insertada.`);
  }

  mongoose.disconnect();
  console.log('Conexión cerrada.');
}).catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});