import express from 'express'
import controller from '../controllers/controlador_historias_clinicas.js'// Importa el controlador

const router = express.Router()

// Ruta para obtener datos de persona
router.post('/buscar_id_historia_clinica', controller.buscarIdHistoriaClinica);
router.post('/buscar_datos_historia_clinica', controller.buscarDatosHistoriaClinica);
router.post('/alta_historia_clinica', controller.altaHistoriaClinica);
router.post('/elaborarInformePaciente', controller.elaborarInformePaciente);
export default router