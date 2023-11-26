import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Camino 1: buscar consultas por enfermedad', () => {
  //antes de cada test
  beforeEach(async () => {
    // Conéctate a tu base de datos original
    const client = new MongoClient(urlConeccionTest, { useUnifiedTopology: true });
    await client.connect();

    // Crea una copia de seguridad de tu base de datos original
    const db = client.db('test');
    const collections = await db.collections();
    const backup = {};

    for (const collection of collections) {
      const data = await collection.find().toArray();
      backup[collection.collectionName] = data;
    }

    await client.close();

    // Conéctate a tu base de datos de pruebas
    const client2 = new MongoClient(urlConeccionTest, { useUnifiedTopology: true });
    await client2.connect();

    // Restaura la copia de seguridad en tu base de datos de pruebas
    const db2 = client2.db('dbTest');

    for (const collectionName in backup) {
      const collectionData = backup[collectionName];
      await db2.collection(collectionName).drop();
      if(collectionName!=="enfermedad"){
      await db2.collection(collectionName).insertMany(collectionData);}
    }

    await client2.close();
    console.log('Se creo la BD de test')
  }, 30000);



  it('Camino 1: no existen enfermedades', async () => {
    //primera solicitud: buscar una persona y que exista en el sistema
    var enfermedades = await request(app)
      .get('/api/obtener_enfermedades')
      

    expect(enfermedades.status).toEqual(404);
    expect(enfermedades.body).toHaveProperty('error', true);
  }, 55000);

});