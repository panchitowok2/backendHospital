import app from '../index'
import request from 'supertest';

describe('Test del método buscarDatosHistoriaClinica', () => {
    //Para la transaccion de alta historia clinica
    //camino 1
  it('La persona no existe y no tiene historia clìnica', async () => {
    //primera solicitud: buscar una persona y que exista en el sistema
    let res = await request(app)
      .post('/api/buscar_IdPersona') 
      .send({ apellido: 'Medhurst' }); 

    expect(res.statusCode).toEqual(404);
    expect(res.body).toHaveProperty('error', true);
    expect(res.body).toHaveProperty('message', 'No existe la historia clinica');

  });

  // Puedes agregar más pruebas aquí para los otros casos
});
