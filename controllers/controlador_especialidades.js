import Especialidad from "../models/especialidad.js";

var controller = {

  obtenerEspecialidades: async (req, res) => {
    const { filter } = req.body;

    const especialidades = await Especialidad.find({
      nombre: { $regex: new RegExp(filter, "i")}, // el parametro "i" lo hace case-insensitive 
    }).select("_id nombre")
    
    if (especialidades.length === 0) {
      return res.status(404).send({
        message: "No se encontraron especialidades que coincidan con el filtro proporcionado"
      })
    }

    return res.status(200).send(especialidades)
  },

}

export default controller