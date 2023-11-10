import express from "express";
import controlador_enfermedades from "../controllers/controlador_enfermedades.js"

const router = express.Router()
router.get('/obtener_enfermedades', controlador_enfermedades.obtener_info_enfermedad)
router.get('/enfermedades/:id', controlador_enfermedades.getById)

export default router;