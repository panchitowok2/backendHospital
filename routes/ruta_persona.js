import express from 'express'
import controlador_persona from '../controllers/controlador_personas.js'// Importa el controlador

const router = express.Router()

// Ruta para obtener datos de persona
router.get('/buscar_persona', controlador_persona.buscarPersona)
router.post('/api/altaPersona', controlador_persona.altaPersona)
router.get('/api/verificarPersona', controlador_persona.verificarPersona)

export default router