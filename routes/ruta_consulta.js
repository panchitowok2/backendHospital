import express from "express";
import controlador_consultas from "../controllers/controlador_consultas.js"

const router = express.Router()
router.get('/verificar_turno', controlador_consultas.verificar_turno)
router.get('/consultas/:id', controlador_consultas.getById)

export default router