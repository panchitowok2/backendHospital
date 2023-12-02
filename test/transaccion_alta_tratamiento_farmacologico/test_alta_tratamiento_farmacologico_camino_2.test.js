import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Camino 2: Alta tratamiento farmacologico', () => {
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
      await db2.collection(collectionName).insertMany(collectionData);
    }

    await client2.close();
    console.log('Se creo la BD de test')
  }, 30000);

  // camino 2
  it('Camino 2: El Id de la persona no existe', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Fabi', documento: 39881919, tipo_documento: 'DNI', sexo: 'M' });

    expect(idPersona.status).toEqual(200);
    expect(idPersona.body).not.toBeNull();

    var datosPersona = await request(app)
      .post('/api/buscar_Datos_Persona')
      .send({ id: 'esteIdNoExisteError404' });

    expect(datosPersona.status).toEqual(404);
    expect(datosPersona.body).toHaveProperty('error', true);
  }, 15000);

});
