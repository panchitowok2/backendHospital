import express from "express";
import controlador_diagnosticos from "../controllers/controlador_diagnosticos.js"

const router = express.Router()
router.post('/alta_diagnostico_completo', controlador_diagnosticos.guardar_diagnostico)
router.get("/obtener_diagnosticos_por_enfermedad",controlador_diagnosticos.obtener_diagnosticos_por_enfermedad)

router.get('/diagnosticos/:id', controlador_diagnosticos.getById)

export default router