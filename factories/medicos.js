import mongoose from 'mongoose'
import { url } from '../config.js'
import { faker } from '@faker-js/faker'
import Persona from '../models/persona.js'
import Medico from '../models/medico.js'
import Especialidad from '../models/especialidad.js'

class FabricaMedicos {
  constructor() {
    this.count = 1;
    this.especialidades = []
  }

  definition() {
    return {
      //_id: faker.string.uuid(),
      tipo_documento: faker.helpers.arrayElement(['LI', 'LE', 'DNI']),
      documento: faker.number.int({ min: 10000000, max: 99999999 }),
      nombre: faker.person.firstName(),
      apellido: faker.person.lastName(),
      telefono: faker.number.int({ min: 100000000, max: 999999999 }),
      email: faker.internet.email(),
      nacionalidad: faker.location.state(),
      fecha_nacimiento: faker.date.birthdate(),
      direccion: faker.location.streetAddress(),
      historia_clinica: null,
      sexo: faker.helpers.arrayElement(['F', 'M']),

      legajo: "M" + faker.number.int({ min: 0, max: 9999 }),
      matricula: faker.number.int({ min: 0, max: 9999 }),
      titulo: faker.helpers.arrayElement(['Medico General', 'Cirujano', 'Partera']),
      fecha_graduacion: faker.date.past(),
      especialidades: faker.helpers.arrayElement(this.especialidades),
      persona: null
    };
  }

  create() {
    mongoose.connect(url).then(async () => {
      console.log('Conexion a la base de datos establecida')

      const espAux = await Especialidad.find({})
      this.especialidades = espAux.map((especialidad) => especialidad._id);

      for (let i = 1; i <= this.count; i++) {
        const nuevaPersona = new Persona(this.definition());
        const verificar_nueva_persona = await Persona.countDocuments(
          {
            tipo_documento: nuevaPersona.tipo_documento,
            documento: nuevaPersona.documento,
            sexo: nuevaPersona.sexo,
            apellido: nuevaPersona.apellido
          })
        if (verificar_nueva_persona < 1) {


          const nuevoMedico = new Medico(this.definition());
          const verificar_nuevo_medico = await Medico.countDocuments({
            legajo: nuevoMedico.legajo,
            matricula: nuevoMedico.matricula
          })
          if (verificar_nuevo_medico < 1) {
            await nuevaPersona.save();
            nuevoMedico.persona = nuevaPersona._id
            await nuevoMedico.save();

            console.log(`Medico "${nuevaPersona.nombre} ${nuevaPersona.apellido}" insertado`);
          }

        }
      }

      mongoose.disconnect();
      console.log('Conexión cerrada.');
    }).catch(error => {
      console.error('Error al conectar a la base de datos:', error);
    });
  }

  setCount(qty) {
    this.count = qty

    return this
  }
}

export default FabricaMedicos