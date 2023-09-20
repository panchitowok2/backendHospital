import express from 'express'
import controlador_medicamentos from '../controllers/controlador_medicamentos.js'

const router = express.Router()

// Ruta para obtener datos de persona
router.get('/buscarMedicamentosMasRecetados', controlador_medicamentos.buscarMedicamentosMasRecetados)

export default router