import express from "express";
import controlador_especialidades from "../controllers/controlador_especialidades.js"

const router = express.Router()
router.get('/especialidades', controlador_especialidades.obtenerEspecialidades)
router.get('/especialidades/:id', controlador_especialidades.getById)
router.get('/especialidades/:id/tratamientos_farmacologicos', controlador_especialidades.obtenerTratamientosFarmacologicosConEspecialidad)

export default router