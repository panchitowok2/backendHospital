import express from "express";
import controlador_turnos from "../controllers/controlador_turnos.js"

const router = express.Router()
router.post('/obtener_turnos', controlador_turnos.obtener_turno)

export default router