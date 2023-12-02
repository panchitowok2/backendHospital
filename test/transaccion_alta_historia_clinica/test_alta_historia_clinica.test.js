import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Test de la transaccion alta historia clinica', () => {
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

  //Para la transaccion de alta historia clinica
  
  //camino 1
  //La persona no existe, le doy de alta, y le asigno una nueva historia clínica  
  it('La persona no existe, le doy de alta, y le asigno una nueva historia clínica', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Medhurs', documento: 33443222, tipo_documento: 'LE', sexo: 'F' });

    expect(idPersona.statusCode).toEqual(404);
    expect(idPersona.body).toHaveProperty('error', true);

    var nuevoIdPersona = await request(app)
      .post('/api/altaPersona')
      .send({ nombre: 'pepito', apellido: 'Perez', documento: 33443225, tipo_documento: 'LE', sexo: 'F', nacionalidad: 'Argentina', direccion: 'av siempre viva 123', telefono: 12123123, email: 'pepito@perez.com', fecha_nacimiento: new Date(1990, 10, 10) });
    expect(nuevoIdPersona.statusCode).toEqual(200);
    expect(nuevoIdPersona.body).not.toBeNull();

    var res = await request(app)
      .post('/api/alta_historia_clinica')
      .send({ grupo_sanguineo: 'A', factor_sanguineo: '+', _id: nuevoIdPersona.body.id })
    expect(res.statusCode).toEqual(200);

  }, 15000);

  //camino 2
  //La persona no existe, y cuando le doy de alta, cargo datos con error
  //en este caso lo que genera el error es el ingreso de datos incorrecto
  it('La persona no existe, y cuando le doy de alta, cargo datos con error', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Medhurs', documento: 33443222, tipo_documento: 'LE', sexo: 'F' });

    expect(idPersona.statusCode).toEqual(404);
    expect(idPersona.body).toHaveProperty('error', true);

    var res = await request(app)
      .post('/api/altaPersona')
      .send({ nombre: 'pepito', apellido: 'Towers', documento: 39650255, tipo_documento: 'DNA', sexo: 'M', nacionalidad: 'Argentina', direccion: 'av siempre viva 123', telefono: 12123123, email: 'pepito@perez.com', fecha_nacimiento: new Date(1990, 10, 10) });
    expect(res.statusCode).toEqual(500);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body.message).toBeTruthy();

  }, 15000);

  //camino 3
  //La persona existe, y tiene historia clinica
  it('La persona existe, y tiene historia clinica', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Fabi', documento: 39881919, tipo_documento: 'DNI', sexo: 'M' });
    expect(idPersona.statusCode).toEqual(200);
    expect(idPersona.body).not.toBeNull();

    var idHC = await request(app)
      .post('/api/buscar_Id_Historia_Clinica_Persona')
      .send({ _id: idPersona.body })
    expect(idHC.statusCode).toEqual(200);
    expect(idHC.body).not.toBeNull();

  }, 15000);

  //camino 4
  //La persona existe, no tiene historia clínica, pero cargo mal los datos
  //El dato mal cargado es el grupo sanguineo
  it('La persona existe, no tiene historia clínica, pero cargo mal los datos', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Towers', documento: 39650255, tipo_documento: 'DNI', sexo: 'M' });
    expect(idPersona.statusCode).toEqual(200);
    expect(idPersona.body).not.toBeNull();

    var idHC = await request(app)
      .post('/api/buscar_Id_Historia_Clinica_Persona')
      .send({ _id: idPersona.body })
    expect(idHC.statusCode).toEqual(404);
    expect(idHC.body).toHaveProperty('error', true);

    var res = await request(app)
      .post('/api/alta_historia_clinica')
      .send({ grupo_sanguineo: 'C', factor_sanguineo: '+', _id: idPersona.body })
    expect(res.statusCode).toEqual(500);
  }, 15000);

  //camino 5
  //La persona no existe, le doy de alta, y cuando le asigno una 
  //nueva historia clínica, cargo los datos de la misma con error  
  it('La persona no existe, le doy de alta, le asigno una nueva historia clínica, pero envío datos erroneos', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Medhurs', documento: 33443222, tipo_documento: 'LE', sexo: 'F' });

    expect(idPersona.statusCode).toEqual(404);
    expect(idPersona.body).toHaveProperty('error', true);

    var nuevoIdPersona = await request(app)
      .post('/api/altaPersona')
      .send({ nombre: 'pepito', apellido: 'Perez', documento: 33443225, tipo_documento: 'LE', sexo: 'F', nacionalidad: 'Argentina', direccion: 'av siempre viva 123', telefono: 12123123, email: 'pepito@perez.com', fecha_nacimiento: new Date(1990, 10, 10) });
    expect(nuevoIdPersona.statusCode).toEqual(200);
    expect(nuevoIdPersona.body).not.toBeNull();

    var res = await request(app)
      .post('/api/alta_historia_clinica')
      .send({ grupo_sanguineo: 'C', factor_sanguineo: '+', _id: nuevoIdPersona.body.id })
    expect(res.statusCode).toEqual(500);

  }, 15000);
  //camino 6
  //Buscar una persona que exista y que no tenga historia clinica  
  it('La persona existe y no tiene historia clínica', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: 'Towers', documento: 39650255, tipo_documento: 'DNI', sexo: 'M' });
    expect(idPersona.statusCode).toEqual(200);
    expect(idPersona.body).not.toBeNull();

    var idHC = await request(app)
      .post('/api/buscar_Id_Historia_Clinica_Persona')
      .send({ _id: idPersona.body })
    expect(idHC.statusCode).toEqual(404);
    expect(idHC.body).toHaveProperty('error', true);

    var res = await request(app)
      .post('/api/alta_historia_clinica')
      .send({ grupo_sanguineo: 'A', factor_sanguineo: '+', _id: idPersona.body })
    expect(res.statusCode).toEqual(200);
  }, 15000);
});
