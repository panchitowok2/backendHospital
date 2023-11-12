import express from 'express'
import controlador_medicamentos from '../controllers/controlador_medicamentos.js'
import { 
  validarRequestMedicamentos, 
  verificarEspecialidad, 
  existenTratamientosEnEsaFecha, 
  existenTratamientosRealizadosPorMedicosConEsaEspecialidad, 
  existenTratamientosEnEsaFechaConDosificaciones 
} from '../middlewares/middleware_medicamento.js';

const router = express.Router()

// Ruta para obtener datos de persona
router.get('/medicamentos', controlador_medicamentos.all)
router.get('/medicamentos/:id', controlador_medicamentos.getById)
router.post('/medicamentos/buscarMedicamentosMasRecetados', validarRequestMedicamentos, verificarEspecialidad, existenTratamientosEnEsaFecha, existenTratamientosRealizadosPorMedicosConEsaEspecialidad, existenTratamientosEnEsaFechaConDosificaciones, controlador_medicamentos.buscarMedicamentosMasRecetados)

export default router