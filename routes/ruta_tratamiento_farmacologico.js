import express from 'express'
import controlador_tratamientos_farmacologicos from '../controllers/controlador_tratamientos_farmacologicos.js'
import mongoose from 'mongoose'
import HistoriaClinica from '../models/historia_clinica.js'
import Diagnostico from '../models/diagnostico.js'

const router = express.Router()

/*
* Se considera que las consultas fueron previamente verificadas al cargarlas en la Historia Clinica
* Es decir que si una consulta esta cargada en la Historia Clinica es porque el Turno apunta al mismo Paciente al que pertenece la Historia Clinica
*/

const existeHistoriaClinica = async (req, res, next) => {
    const params = req.body;

    try {
        const historia_clinica = await HistoriaClinica.findOne({ _id: params.historia_clinica })

        if (! historia_clinica) {
            return res.status(404).json({ error: 'La Historia Clinica no existe en la base de datos' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error en la consulta de Historia Clinica' });
    }
};

const existeDiagnostico = async (req, res, next) => {
    const params = req.body;

    try {
        const diagnostico = await Diagnostico.findOne({ _id: params.diagnostico })

        if (! diagnostico) {
            return res.status(404).json({ error: 'El Diagnostico no existe en la base de datos' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error en la consulta de diagnóstico' });
    }
};

/* Verifica que el diagnostico pertenezca a una consulta cargada en la Historia Clinica */
const verificarConsultaDelDiagnostico = async (req, res, next) => {
    const params = req.body;

    try {
        const historia_clinica = await HistoriaClinica.findOne({ _id: params.historia_clinica })

        const diagnostico = await Diagnostico.findOne({ _id: params.diagnostico })

        let consultaEncontrada = false;

        historia_clinica.consultas.forEach(consulta => {
            if (consulta.toString() == diagnostico.consulta.toString())
                consultaEncontrada = true
        });

        if (! consultaEncontrada)
            return res.status(404).json({ error: 'La consulta no se encuentra cargada en la Historia Clinica' });

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error en la consulta de diagnóstico' });
    }
};

/* Verifica que el diagnostico del tratamiento este cargado en la Historia Clinica del paciente */
const verificarDiagnosticoEnHistoriaClinica = async (req, res, next) => {
    const params = req.body;

    const diagnosticoId = new mongoose.Types.ObjectId(params.diagnostico)

    try {
        const historia_clinica = await HistoriaClinica.findOne({ _id: params.historia_clinica })

        let diagnosticoEncontrado = false;

        historia_clinica.diagnosticos.forEach(diagnostico => {
            if (diagnostico.toString() == diagnosticoId.toString())
                diagnosticoEncontrado = true
        });

        if (! diagnosticoEncontrado)
            return res.status(404).json({ error: 'El diagnostico no se encuentra cargado en la Historia Clinica' });

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error en la consulta de diagnóstico' });
    }
};

/* Verifica que los diagnosticos pertenecen al mismo medico que solicito el tratamiento */
const verificarMedicoDelDiagnostico = async (req, res, next) => {
    const params = req.body;
    
    const medicoId = new mongoose.Types.ObjectId(params.medico);

    try {
        const diagnostico = await Diagnostico.findOne({ _id: params.diagnostico }).populate('consulta')

        if (medicoId.toString() !== diagnostico.consulta.medico.toString()) {
            return res.status(500).json({ error: 'El médico del diagnóstico no coincide con el del tratamiento' });
        }
        
        // Aceptar la solicitud
        next();
    } catch (error) {
        return res.status(500).json({ error: 'Error en la consulta de diagnóstico' });
    }
};


// Ruta para obtener datos de persona
router.post('/altaTratamientoFarmacologico', existeHistoriaClinica, existeDiagnostico, verificarConsultaDelDiagnostico, verificarDiagnosticoEnHistoriaClinica, verificarMedicoDelDiagnostico, controlador_tratamientos_farmacologicos.altaTratamientoFarmacologico)

export default router