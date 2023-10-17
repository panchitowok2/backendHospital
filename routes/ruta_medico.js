import express from "express";
import controlador_medico from "../controllers/controllador_medicos.js";

const router = express.Router()
router.get('/obtener_medicos', controlador_medico.obtener_info_medicos)

export default router