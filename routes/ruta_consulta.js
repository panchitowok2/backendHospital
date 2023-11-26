import express from "express";
import controlador_consultas from "../controllers/controlador_consultas.js"

const router = express.Router()
router.get('/verificar_turno', controlador_consultas.verificar_turno)
router.get('/consultas/:id', controlador_consultas.getById)
router.post("/buscar_consultas_por_fechas",controlador_consultas.buscar_consultas_por_fechas)

export default router