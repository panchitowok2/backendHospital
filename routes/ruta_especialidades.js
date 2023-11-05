import express from "express";
import controlador_especialidades from "../controllers/controlador_especialidades.js"

const router = express.Router()
router.post('/obtenerEspecialidades', controlador_especialidades.obtenerEspecialidades)

export default router