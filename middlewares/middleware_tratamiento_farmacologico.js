import mongoose from 'mongoose'
import HistoriaClinica from '../models/historia_clinica.js'
import Diagnostico from '../models/diagnostico.js'

/* Verificar que el usuario haya ingresado dosificaciones */
const verificarDosificaciones = async (req, res, next) => {
  const params = req.body;

  if (!params.dosificaciones || !Array.isArray(params.dosificaciones)) {
      return res.status(400).json({ message: 'El campo "dosificaciones" debe ser un array' });
  }

  if (params.dosificaciones.length === 0)
    return res.status(400).json({ message: 'El campo "dosificaciones" no debe estar vacio' });
  
  next();
};

const existeHistoriaClinica = async (req, res, next) => {
  const params = req.body;

  try {
      const historia_clinica = await HistoriaClinica.findOne({ _id: params.historia_clinica })

      if (! historia_clinica) {
          return res.status(404).json({ message: 'La Historia Clinica no existe en la base de datos' });
      }

      next();
  } catch (err) {
      return res.status(500).json({ 
          message: 'Error al verificar si existe la Historia Clinica',
          errors: err.errors
      });
  }
};

const existeDiagnostico = async (req, res, next) => {
  const params = req.body;

  try {
      const diagnostico = await Diagnostico.findOne({ _id: params.diagnostico })

      if (! diagnostico) {
          return res.status(404).json({ message: 'El Diagnostico no existe en la base de datos' });
      }

      next();
  } catch (err) {
      return res.status(500).json({ 
          message: 'Error en la consulta de diagnóstico',
          errors: err.errors
      });
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
          return res.status(404).json({ message: 'La consulta no se encuentra cargada en la Historia Clinica' });

      next();
  } catch (err) {
      return res.status(500).json({ 
          message: 'Error en la consulta de diagnóstico',
          errors: err.errors 
      });
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
  } catch (err) {
      return res.status(500).json({ 
          message: 'Error en la consulta de diagnóstico',
          errors: err.errors 
      });
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
  } catch (err) {
      return res.status(500).json({ 
          message: 'Error en la consulta de diagnóstico',
          errors: err.errors 
      });
  }
};

export {
  verificarDosificaciones,
  existeHistoriaClinica,
  existeDiagnostico,
  verificarConsultaDelDiagnostico,
  verificarDiagnosticoEnHistoriaClinica,
  verificarMedicoDelDiagnostico
}