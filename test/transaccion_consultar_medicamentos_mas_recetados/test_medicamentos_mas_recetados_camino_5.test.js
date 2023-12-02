import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Camino 5: Consultar medicamentos mas recetados', () => {
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

  //camino 5
  it('Camino 5: Consultar los medicamentos más recetados con exito', async () => {
    var especialidades = await request(app)
      .get('/api/especialidades');

    const especialidadesJson = JSON.stringify(especialidades.body);

    expect(especialidades.status).toEqual(200);
    expect(especialidades.body).not.toBeNull();
    expect(especialidadesJson.length).toBeGreaterThan(0);

    var especialidadId = JSON.stringify(especialidades.body[0]._id)
    especialidadId = especialidadId.slice(1, -1) // PARA ELIMINAR LAS DOBLES COMILLAS

    var tratamientosConEspecialidad = await request(app)
      .get(`/api/especialidades/${especialidadId}/tratamientos_farmacologicos`)

    const tratamientosConEspecialidadJson = JSON.stringify(especialidades.body);

    expect(tratamientosConEspecialidad.status).toEqual(200);
    expect(tratamientosConEspecialidad.body).not.toBeNull();
    expect(tratamientosConEspecialidadJson.length).toBeGreaterThan(0);

    // fechas muy amplias para obtener cualquier tratamiento
    const fechaInicio = '1950-01-01';
    const fechaFin = '2060-01-01'; 

    var tratamientosEnEsaFecha = await request(app)
      .get(`/api/tratamientos_farmacologicos/buscar`)
      .query({ fecha_inicio: fechaInicio, fecha_final: fechaFin });

    const tratamientosEnEsaFechaJson = JSON.stringify(tratamientosEnEsaFecha.body);

    expect(tratamientosEnEsaFecha.status).toEqual(200);
    expect(tratamientosEnEsaFecha.body).not.toBeNull();
    expect(tratamientosEnEsaFechaJson.length).toBeGreaterThan(0);

    var dataParams = {
      "especialidad": "651c816eeddf5cd261e13079",
      "fecha_inicio": "1950-01-01",
      "fecha_final": "2050-01-01"
    }

    var medicamentosMasRecetados = await request(app)
      .post(`/api/medicamentos/buscarMedicamentosMasRecetados`)
      .send(dataParams);

    const medicamentosMasRecetadosJson = JSON.stringify(medicamentosMasRecetados.body);
    
    expect(medicamentosMasRecetados.status).toEqual(200);
    expect(medicamentosMasRecetados.body).not.toBeNull();
    expect(medicamentosMasRecetadosJson.length).toBeGreaterThan(0);
    
  }, 15000);

});
