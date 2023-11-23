import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Camino 3: Alta tratamiento farmacologico', () => {
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

  // camino 3
  it('Camino 3: La persona no tiene historia clínica', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: "Brekke-Satterfield", documento: 98960066, tipo_documento: "DNI", sexo: "M" });

    expect(idPersona.status).toEqual(200);

    var datosPersona = await request(app)
      .post('/api/buscar_Datos_Persona')
      .send({ _id: idPersona.body });

    expect(datosPersona.status).toEqual(200);

    var datosHistoriaClinica = await request(app)
      .post('/api/buscar_datos_historia_clinica')
      .send({ _id: datosPersona.body.historia_clinica });


    expect(datosHistoriaClinica.status).toEqual(404);
    expect(datosHistoriaClinica.body).toHaveProperty('error', true);
  }, 15000);

});
