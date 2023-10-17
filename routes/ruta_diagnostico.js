import express from "express";
import controlador_diagnosticos from "../controllers/controlador_diagnosticos.js"

const router = express.Router()
router.get('/alta_diagnostico_completo', controlador_diagnosticos.guardar_diagnostico)
router.get("/obtener_diagnosticos_por_enfermedad",controlador_diagnosticos.obtener_diagnosticos_por_enfermedad)

export default router