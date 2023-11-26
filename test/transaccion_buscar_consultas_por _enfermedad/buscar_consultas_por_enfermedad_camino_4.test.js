import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Camino 4: buscar consultas por enfermedad', () => {
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



  it('Camino 4: existen enfermedades,existen consultas en esas fechas,existen diagnosticos para esa enfermedad, no existen consultas con esa enfermedad y en esas fechas', async () => {
    //primera solicitud: buscar una persona y que exista en el sistema
    var enfermedades = await request(app)
      .get('/api/obtener_enfermedades')
      

    expect(enfermedades.status).toEqual(200);
 
 var consultas_fechas=await request(app)
 .post('/api/buscar_consultas_por_fechas')
 .send({"fechaInicio":"1960/01/01","fechaFin":"2020/04/22"})
 
 expect(consultas_fechas.status).toEqual(200);

 var diagnosticos_enfermedad=await request(app)
 .post('/api/buscar_diagnosticos_solo_por_enfermedad')
 .send({"id_enfermedad":"651c8165c2688411e6edc9df"})
 expect(diagnosticos_enfermedad.status).toEqual(200)


 var consultas_por_enfermedad= await request(app)
 .post("/api/obtener_diagnosticos_por_enfermedad")
 .send({"id_enfermedad":"651c8165c2688411e6edc9df", "fecha_inicio":"1960/01/01","fecha_fin":"2020/04/22"})
 expect(consultas_por_enfermedad.status).toEqual(404);
 expect(consultas_por_enfermedad.body).toHaveProperty('error', true);
    

  }, 55000);


});