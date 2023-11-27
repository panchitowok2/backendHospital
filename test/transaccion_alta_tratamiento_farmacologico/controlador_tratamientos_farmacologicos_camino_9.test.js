import app from '../../index'
import request from 'supertest';
import { MongoClient } from 'mongodb'
import { urlConeccionTest } from '../../config';

describe('Camino 9: Alta tratamiento farmacologico', () => {
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

  // camino 9
  it('Camino 9: Error al crear un tratamiento', async () => {
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

    var diagnosticosHistoriaClinica = await request(app)
      .get(`/api/historias_clinicas/${datosHistoriaClinica.body._id}/diagnosticos`)

    const diagnosticosHistoriaClinicaJson = JSON.stringify(diagnosticosHistoriaClinica.body);

    expect(diagnosticosHistoriaClinica.status).toEqual(200);
    expect(diagnosticosHistoriaClinica.body).not.toBeNull();
    expect(diagnosticosHistoriaClinicaJson.length).toBeGreaterThan(0);

    var diagnosticos = JSON.parse(JSON.stringify(diagnosticosHistoriaClinica.body));
    var consultaId = JSON.stringify(diagnosticos[0].consulta)
    consultaId = consultaId.slice(1, -1) // PARA ELIMINAR LAS DOBLES COMILLAS
    
    var consultaDiagnostico = await request(app)
      .get(`/api/consultas/${consultaId}`)

    expect(consultaDiagnostico.status).toEqual(200);
    expect(consultaDiagnostico.body._id).toEqual(consultaId);

    var medicoId = consultaDiagnostico.body.medico;

    var medico = await request(app)
      .get(`/api/medicos/${medicoId}`)

    expect(medico.status).toEqual(200);
    expect(medico.body._id).toEqual(medicoId);
    expect(consultaDiagnostico.body.medico).toEqual(medico.body._id);

    var especialidades = await request(app)
      .get(`/api/medicos/${medicoId}/especialidades`)

    const especialidadesJson = JSON.stringify(especialidades.body);

    expect(especialidades.status).toEqual(200);
    expect(especialidades.body).not.toBeNull();
    expect(especialidadesJson.length).toBeGreaterThan(0);

    var medicamentos = await request(app)
      .get(`/api/medicamentos`)

    const medicamentosJson = JSON.stringify(medicamentos.body);

    expect(medicamentos.status).toEqual(200);
    expect(medicamentos.body).not.toBeNull();
    expect(medicamentosJson.length).toBeGreaterThan(0);

    var tratamientoSinDatos = await request(app)
      .post('/api/tratamientos_farmacologicos')
      .send({   });

    expect(tratamientoSinDatos.status).toEqual(400);

    var arrMedicamentos = JSON.parse(JSON.stringify(medicamentos.body));
    var idMedicamentoAleatorio = JSON.stringify(arrMedicamentos[0]._id)
    var dosificaciones = [{ dosis: "3 veces por semana", "medicamento": idMedicamentoAleatorio }] 
    var diagnosticoId = JSON.stringify(diagnosticos[0]._id)
    diagnosticoId = diagnosticoId.slice(1, -1) // PARA ELIMINAR LAS DOBLES COMILLAS

    var dataParams = {
      "dosificaciones": dosificaciones,
      "historia_clinica": datosHistoriaClinica.body._id,
      "diagnostico": diagnosticoId,
      "medico": medico.body._id,
      //"descripcion": "descripcion requerida comentada para test",
      "fecha_inicio": "2023-10-10",
      "duracion": "10 dias"
    }

    var tratamientoConError = await request(app)
      .post('/api/tratamientos_farmacologicos')
      .send(dataParams);

    expect(tratamientoConError.status).toEqual(500);

  }, 30000);


});
