import express from "express";
import controlador_consultas from "../controllers/controlador_consultas.js"

const router = express.Router()
router.get('/verificar_turno', controlador_consultas.verificar_turno)

export default router