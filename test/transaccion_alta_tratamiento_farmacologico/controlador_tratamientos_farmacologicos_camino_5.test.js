import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Camino 5: Alta tratamiento farmacologico', () => {
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

  // camino 5
  it('Camino 5: La consulta no existe', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: "Fabi", documento: 39881919, tipo_documento: "DNI", sexo: "M" });

    expect(idPersona.status).toEqual(200);
    expect(idPersona.body).not.toBeNull();

    var datosPersona = await request(app)
      .post('/api/buscar_Datos_Persona')
      .send({ _id: idPersona.body });

    const datosPersonaJson = JSON.stringify(datosPersona.body);

    expect(datosPersona.status).toEqual(200);
    expect(datosPersona.body).not.toBeNull();
    expect(datosPersonaJson.length).toBeGreaterThan(0);
    expect(datosPersona.body._id).toBeDefined(); // Verifica que _id esté definido
    expect(datosPersona.body._id).toBeTruthy(); // Verifica que _id tenga un valor que se evalúe como verdadero (no vacío)
    expect(datosPersona.body._id).toEqual(idPersona.body);
    
    var datosHistoriaClinica = await request(app)
      .post('/api/buscar_datos_historia_clinica')
      .send({ "_id": datosPersona.body.historia_clinica });

    const datosHistoriaClinicaJson = JSON.stringify(datosHistoriaClinica.body);

    expect(datosHistoriaClinica.status).toEqual(200);
    expect(datosHistoriaClinica.body).not.toBeNull();
    expect(datosHistoriaClinicaJson.length).toBeGreaterThan(0);
    expect(datosHistoriaClinica.body._id).toBeDefined(); // Verifica que _id esté definido
    expect(datosHistoriaClinica.body._id).toBeTruthy(); // Verifica que _id tenga un valor que se evalúe como verdadero (no vacío)
    expect(datosHistoriaClinica.body._id).toEqual(datosPersona.body.historia_clinica);

    var diagnosticosHistoriaClinica = await request(app)
      .get(`/api/historias_clinicas/${datosHistoriaClinica.body._id}/diagnosticos`)

    const diagnosticosHistoriaClinicaJson = JSON.stringify(diagnosticosHistoriaClinica.body);

    expect(diagnosticosHistoriaClinica.status).toEqual(200);
    expect(diagnosticosHistoriaClinica.body).not.toBeNull();
    expect(diagnosticosHistoriaClinicaJson.length).toBeGreaterThan(0);

    var consultaDiagnostico = await request(app)
      .get(`/api/consultas/000000000000000000000000`)

    expect(consultaDiagnostico.status).toEqual(404);

    
  }, 30000);


});
