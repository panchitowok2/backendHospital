import express from 'express'
import controlador_persona from '../controllers/controlador_personas.js'// Importa el controlador

const router = express.Router()

// Ruta para obtener datos de persona
router.post('/buscar_IdPersona', controlador_persona.buscarIdPersona)
router.post('/buscar_Datos_Persona', controlador_persona.buscarDatosPersona)
router.post('/buscar_Id_Historia_Clinica_Persona', controlador_persona.buscarIdHistoriaClinicaSegunIdPersona)
router.post('/altaPersona', controlador_persona.altaPersona)
router.post('/verificarPersona', controlador_persona.verificarPersona)

export default router