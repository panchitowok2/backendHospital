import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Test de la transaccion informe de un paciente', () => {
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

  //camino 1
  //Buscar una persona que exista y que tenga historia clinica, pero se envían mal
  //los datos en la request de informe de paciente  
  it('La persona existe, tiene historia clínica pero se envían mal los datos', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Medhurst', documento: 33443222, tipo_documento: 'LE', sexo: 'F' });
    expect(idPersona.statusCode).toEqual(200);
    expect(idPersona.body).not.toBeNull();

    var idHC = await request(app)
      .post('/api/buscar_Id_Historia_Clinica_Persona')
      .send({ _id: idPersona.body })
    expect(idHC.statusCode).toEqual(200);

    var res = await request(app)
      .post('/api/elaborarInformePaciente')
      .send({ _id: 122 })
    expect(res.statusCode).toEqual(404);
    expect(res.body).not.toBeNull();
  }, 15000);

  //camino 2
  //Buscar una persona que no existe 
  it('La persona no existe', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Medhurs', documento: 33443222, tipo_documento: 'LE', sexo: 'F' });
    expect(idPersona.statusCode).toEqual(404);
  }, 15000);

  //camino 3
  //Buscar una persona que existe, pero no tiene historia clínica 
  it('Buscar una persona que existe, pero no tiene historia clínica', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Towers', documento: 39650255, tipo_documento: 'DNI', sexo: 'M' });
      expect(idPersona.statusCode).toEqual(200);
      expect(idPersona.body).not.toBeNull();

    var idHC = await request(app)
      .post('/api/buscar_Id_Historia_Clinica_Persona')
      .send({ _id: idPersona.body })
    expect(idHC.statusCode).toEqual(404);
  }, 15000);

  //camino 4
  //Buscar una persona que exista y que tenga historia clinica
  it('La persona existe y tiene historia clínica', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Medhurst', documento: 33443222, tipo_documento: 'LE', sexo: 'F' });
    expect(idPersona.statusCode).toEqual(200);
    expect(idPersona.body).not.toBeNull();

    var idHC = await request(app)
      .post('/api/buscar_Id_Historia_Clinica_Persona')
      .send({ _id: idPersona.body })
    expect(idHC.statusCode).toEqual(200);

    var res = await request(app)
      .post('/api/elaborarInformePaciente')
      .send({ _id: idPersona.body })
    expect(res.statusCode).toEqual(200);
    expect(res.body).not.toBeNull();
  }, 15000);
  });
