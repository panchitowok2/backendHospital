import Enfermedad from "../models/enfermedad.js"
import mongoose from "mongoose";

var controller_enfermedad = {
  obtener_enfermedades: async () => {
    try {
      
      const enfermedades = await Enfermedad.find({})
      if (!enfermedades) {
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
  }
}
export default controller_enfermedad