import {MongoClient} from 'mongodb';
import enfermedad from '../models/enfermedad.js';
import medicamento from '../models/medicamento.js';
import especialidad from '../models/especialidad.js';

import {PORT, url} from '../config.js'

const nombreDB = 'test'
//const enfermedad = 'enfermedad'

// Datos que deseas insertar en la base de datos
const datosEnfermedad = [
  {_id: 1 , nombre: 'resfrio', tipo: 'viral' },
  { _id: 2 , nombre: 'neumonia', tipo: 'respiratoria' },
];

// Función para insertar datos en la base de datos
async function InsertarDatos() {
  const client = new MongoClient(url)
  try {
    await client.connect();
    const db = client.db(nombreDB)
    const collection = db.collection('enfermedad')
    await collection.deleteMany({});
    await collection.insertMany(datosEnfermedad); // Usar await para esperar la operación asincrónica
    console.log('Datos insertados correctamente.');
  } catch (error) {
    console.error('Error al insertar datos:', error);
  } finally{
    client.close();
  }
}

// Llama a la función para insertar datos
InsertarDatos(); // No necesitas exportarla aquí
