import express from 'express'
import controller from '../controllers/controlador_historias_clinicas.js'// Importa el controlador

const router = express.Router()

// Ruta para obtener datos de persona
router.get('/buscar_historia_clinica', controller.buscarHistoriaClinica);
router.post('/alta_historia_clinica', controller.altaHistoriaClinica);
router.get('/elaborarInformePaciente', controller.elaborarInformePaciente);
export default router