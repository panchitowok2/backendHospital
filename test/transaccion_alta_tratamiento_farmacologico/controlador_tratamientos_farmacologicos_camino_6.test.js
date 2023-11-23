import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Camino 6: Alta tratamiento farmacologico', () => {
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

  // camino 4
  it('Camino 6: El Medico no existe', async () => {
    var idPersona = await request(app)
      .post('/api/buscar_IdPersona')
      .send({ apellido: "Fabi", documento: 39881919, tipo_documento: "DNI", sexo: "M" });

    expect(idPersona.status).toEqual(200);

    var datosPersona = await request(app)
      .post('/api/buscar_Datos_Persona')
      .send({ _id: idPersona.body });

    expect(datosPersona.status).toEqual(200);

    var datosHistoriaClinica = await request(app)
      .post('/api/buscar_datos_historia_clinica')
      .send({ "_id": datosPersona.body.historia_clinica });

    expect(datosHistoriaClinica.status).toEqual(200);

    var diagnosticosHistoriaClinica = await request(app)
      .get(`/api/historias_clinicas/${datosHistoriaClinica.body._id}/diagnosticos`)

    expect(diagnosticosHistoriaClinica.status).toEqual(200);
    expect(diagnosticosHistoriaClinica.body).not.toBeNull();
    expect(diagnosticosHistoriaClinica.body.length).toBeGreaterThan(0);

    var diagnosticos = JSON.parse(JSON.stringify(diagnosticosHistoriaClinica.body));
    var consultaId = JSON.stringify(diagnosticos[0].consulta)
    consultaId = consultaId.slice(1, -1) // PARA ELIMINAR LAS DOBLES COMILLAS
    
    var consultaDiagnostico = await request(app)
      .get(`/api/consultas/${consultaId}`)

    expect(consultaDiagnostico.status).toEqual(200);
    expect(consultaDiagnostico.body._id).toEqual(consultaId);

    var medico = await request(app)
      .get(`/api/medicos/000000000000000000000000`)

    expect(medico.status).toEqual(404);

  }, 30000);


});
