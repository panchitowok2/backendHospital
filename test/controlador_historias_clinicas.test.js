import app from '../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../config';

describe('Test del método buscarDatosHistoriaClinica', () => {
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
  }, 10000);

  //Para la transaccion de alta historia clinica
  //camino 1
  
  it('La persona no existe y no tiene historia clìnica', async () => {
    //primera solicitud: buscar una persona y que exista en el sistema
    let res = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Medhurs', documento: 33443222, tipo_documento: 'LE', sexo: 'F' });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', true);
  });
  //La persona no existe y le doy de alta
  it('La persona no existe y le doy de alta', async () => {
    //primera solicitud: buscar una persona y que exista en el sistema
    let res = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Medhurs', documento: 33443222, tipo_documento: 'LE', sexo: 'F' });

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', true);

    res = await request(app)
      .post('/api/altaPersona')
      .send({ nombre: 'pepito', apellido: 'Perez', documento: 33443222, tipo_documento: 'LE', sexo: 'F', nacionalidad:'Argentina', direccion:'av siempre viva 123', telefono: 12123123, email: 'pepito@perez.com', fecha_nacimiento: new Date(1990, 10, 10) });
      expect(res.statusCode).toEqual(200);
      
    });

  // Puedes agregar más pruebas aquí para los otros casos
});
