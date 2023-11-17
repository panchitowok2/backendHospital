import mongoose from 'mongoose'
import { url } from "../config.js"
import Persona from '../models/persona.js'
import { faker } from '@faker-js/faker'
import HistoriaClinica from '../models/historia_clinica.js';

class FabricaDePersonas {
  constructor() {
    this.count = 1;
  }

  definition() {
    const sex = faker.person.sexType();
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const direccion = faker.location.streetAddress();
    const dni = faker.number.int({ min: 10000000, max: 99999999 });
    const telefono = faker.number.int({ min: 100000000, max: 999999999 });

    return {
      tipo_documento: faker.helpers.arrayElement(['LC', 'LE', 'DNI']),
      documento: dni,
      nombre: firstName,
      apellido: lastName,
      telefono: telefono,
      email: email,
      nacionalidad: "Argentina",
      fecha_nacimiento: faker.date.birthdate(),
      direccion: direccion,
      historia_clinica: null,
      sexo: sex[0].toUpperCase()
    };
  }

  create() {
    mongoose.connect(url).then(async () => {
      console.log('Conexion a la base de datos establecida')

      for (let i = 1; i <= this.count; i++) {
        const nuevaPersona = new Persona(this.definition());
        const verificar_persona = await Persona.countDocuments(
          {
            tipo_documento: nuevaPersona.tipo_documento,
            documento: nuevaPersona.documento,
            sexo: nuevaPersona.sexo,
            apellido: nuevaPersona.apellido
          })
        if (verificar_persona < 1) {
          const nueva_historia_clinica = new HistoriaClinica({
            grupo_sanguineo: faker.helpers.arrayElement(['A', 'B', 'AB', 'O']),
            factor_sanguineo: faker.helpers.arrayElement(['+', '-'])
          })
          await nueva_historia_clinica.save()
          nuevaPersona.historia_clinica = nueva_historia_clinica._id

          await nuevaPersona.save();

          console.log(`Persona "${nuevaPersona.nombre} ${nuevaPersona.apellido}" insertada.`);

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

export default FabricaDePersonas