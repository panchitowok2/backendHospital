import express from "express";
import controlador_medico from "../controllers/controllador_medicos.js";

const router = express.Router()
router.get('/obtener_medicos', controlador_medico.obtener_info_medicos)
router.get('/medicos/:id', controlador_medico.getById)
router.get('/medicos/:id/especialidades', controlador_medico.obtenerEspecialidades)

export default router