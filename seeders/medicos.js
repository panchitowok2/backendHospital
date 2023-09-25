import mongoose from 'mongoose'
import {url} from '../config.js'
import Persona from '../models/persona.js'
import Medico from '../models/medico.js'
import Especialidad from '../models/especialidad.js'

mongoose.connect(url).then(async () => {
  console.log('Conexion a la base de datos establecida')
    
  const medicos = [
    {
        tipo_documento: "DNI",
        documento: 12345678,
        nombre: "Franco",
        apellido: "Colapinto",
        telefono: 1341132,
        email: "valen123@example.com",
        nacionalidad: "Argentina",
        fecha_nacimiento: "1990-05-15",
        direccion: "Calle 123",
        historia_clinica: null,
        sexo: "M",

        // datos de medico
        legajo: "M12345",
        matricula: "1234567",
        titulo: "Médico General",
        fecha_graduacion: new Date("2000-07-15"),
        especialidad: null,
        persona: null 
    },
    {
        tipo_documento: "Pasaporte",
        documento: 87654321,
        nombre: "Valentina",
        apellido: "Verstappen",
        telefono: 999888777,
        email: "valentina22@example.com",
        nacionalidad: "España",
        fecha_nacimiento: "1985-12-10",
        direccion: "Avenida Principal",
        historia_clinica: null,
        sexo: "F",
        // datos de medico
        legajo: "M54321",
        matricula: "7654321",
        titulo: "Pediatra",
        fecha_graduacion: new Date("2005-05-20"),
        especialidad: null,
        persona: null
    },
    
  ];

  const especialidades = await Especialidad.find({})
  const IdEspecialidades = especialidades.map((especialidad) => especialidad._id);

  for (const medico of medicos) {
    const nuevaPersona = new Persona(medico);
    await nuevaPersona.save();

    medico.persona = nuevaPersona._id

    const indiceAleatorio = Math.floor(Math.random() * IdEspecialidades.length)
    medico.especialidad = IdEspecialidades[indiceAleatorio]

    const nuevoMedico = new Medico(medico);
    await nuevoMedico.save();
    
    console.log(`Medico "${medico.nombre} ${medico.apellido}" insertado.`);
  }

  mongoose.disconnect();
  console.log('Conexión cerrada.');
}).catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});