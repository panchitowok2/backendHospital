import Especialidad from "../models/especialidad.js";

var controller = {

  obtenerEspecialidades: async (req, res) => {
    const { filter } = req.body;

    const especialidades = await Especialidad.find({
      nombre: { $regex: new RegExp(filter, "i")}, // el parametro "i" lo hace case-insensitive 
    }).select("_id nombre")
    .sort({ nombre: 1 }); // 1 para orden ascendente
    
    if (especialidades.length === 0) {
      return res.status(404).send({
        message: "No se encontraron especialidades que coincidan con el filtro proporcionado"
      })
    }

    return res.status(200).send(especialidades)
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