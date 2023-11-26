import Enfermedad from "../models/enfermedad.js"
import mongoose from "mongoose";

var controller_enfermedad = {
  obtener_enfermedades: async () => {
    try {
      
      const enfermedades = await Enfermedad.find({}).select("_id nombre")
      .sort({ nombre: 1 })
      if (enfermedades.length==0) {
        return null;
      }
     
      return enfermedades
    } catch (error) {
      throw new Error('No ha sido posible buscar las enfermedades');
    }
  },
  obtener_info_enfermedad: async (req, res) => {
    try {
     
      const enfermedades_info = await controller_enfermedad.obtener_enfermedades();
      if (!enfermedades_info) {
        return res.status(404).send({
          error: true,
          message: "no existen enfermedades"
        });
      }
      return res.status(200).send(enfermedades_info);
    } catch (error) {
      return res.status(500).send({
        error: true,
        message: "error al buscar las enfermedades"
      });
    }
  },
  getById: async (req, res) => {
    try {
        const enfermedadId = req.params.id; 

        const enfermedad = await Enfermedad.findOne({ _id: enfermedadId });

        if (!enfermedad) {
            return res.status(404).json({ message: 'Enfermedad no encontrada' });
        }

        return res.status(200).json(enfermedad);
    } catch (err) {
        return res.status(500).json({ 
          message: 'Error interno del servidor',
          errors: err.errors
        });
    }
  }
}
export default controller_enfermedad