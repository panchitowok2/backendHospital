import express from 'express'
import controlador_tratamientos_farmacologicos from '../controllers/controlador_tratamientos_farmacologicos.js'
import { 
    verificarDosificaciones,
    existeHistoriaClinica,
    existeDiagnostico,
    verificarConsultaDelDiagnostico,
    verificarDiagnosticoEnHistoriaClinica,
    verificarMedicoDelDiagnostico
  } from '../middlewares/middleware_tratamiento_farmacologico.js';

const router = express.Router()

/*
* Se considera que las consultas fueron previamente verificadas al cargarlas en la Historia Clinica
* Es decir que si una consulta esta cargada en la Historia Clinica es porque el Turno apunta al mismo Paciente al que pertenece la Historia Clinica
*/


// Ruta para obtener datos de persona
router.post('/tratamientos_farmacologicos', verificarDosificaciones, existeHistoriaClinica, existeDiagnostico, verificarConsultaDelDiagnostico, verificarDiagnosticoEnHistoriaClinica, verificarMedicoDelDiagnostico, controlador_tratamientos_farmacologicos.altaTratamientoFarmacologico)
router.get('/tratamientos_farmacologicos/buscar', controlador_tratamientos_farmacologicos.buscarTratamientosFarmacologicosEnLaFecha)

export default router