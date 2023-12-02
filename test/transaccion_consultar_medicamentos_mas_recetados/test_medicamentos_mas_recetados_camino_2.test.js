import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Camino 2: Consultar medicamentos mas recetados', () => {
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

  //camino 2
  it('Camino 2: No existen tratamientos farmacológicos recetados por dicho especialista', async () => {
    var especialidades = await request(app)
      .get('/api/especialidades');

    const especialidadesJson = JSON.stringify(especialidades.body);

    expect(especialidades.status).toEqual(200);
    expect(especialidades.body).not.toBeNull();
    expect(especialidadesJson.length).toBeGreaterThan(0);

    var especialidadId = JSON.stringify(especialidades.body[0]._id)
    especialidadId = especialidadId.slice(1, -1) // PARA ELIMINAR LAS DOBLES COMILLAS

    var tratamientosConEspecialidad = await request(app)
      .get(`/api/especialidades/6564263ba1afde23972f91df/tratamientos_farmacologicos`)

    expect(tratamientosConEspecialidad.status).toEqual(404);
  }, 15000);

});
