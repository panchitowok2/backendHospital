import express from 'express'
import controlador_tratamientos_farmacologicos from '../controllers/controlador_tratamientos_farmacologicos.js'

const router = express.Router()

// Ruta para obtener datos de persona
router.post('/altaTratamientoFarmacologico', controlador_tratamientos_farmacologicos.altaTratamientoFarmacologico)

export default router