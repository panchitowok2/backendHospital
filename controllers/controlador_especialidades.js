import Especialidad from "../models/especialidad.js";

var controller = {

  obtenerEspecialidades: async (req, res) => {
    try {
      const especialidades = await Especialidad.find({ })
      .select("_id nombre")
      .sort({ nombre: 1 }); // 1 para orden ascendente
      
      if (especialidades.length === 0) {
        return res.status(404).send({
          message: "No se encontraron especialidades"
        })
      }

      return res.status(200).send(especialidades)
    } catch (err) {
      return res.status(500).json({ 
        message: 'Error interno del servidor',
        errors: err.errors
      });
    }
  },
  getById: async (req, res) => {
    try {
        const especialidadId = req.params.id; 

        const especialidad = await Especialidad.findOne({ _id: especialidadId });

        if (! especialidad) {
            return res.status(404).json({ message: 'Especialidad no encontrada' });
        }

        return res.status(200).json(especialidad);
    } catch (err) {
        return res.status(500).json({ 
          message: 'Error interno del servidor',
          errors: err.errors
        });
    }
  }

}

export default controller