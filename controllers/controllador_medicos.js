import Medico from "../models/medico.js"

var controller_medico = {

    obtener_datos_personales_medicos:async()=>{
     try {
        const medicos=await Medico.find()
        .populate("especialidad","nombre")
        .populate("persona","nombre apellido");
        
        if (!medicos) {
            return null;
            
        }
        const medicos_info= medicos.map (medico=>({
            _id:medico._id,
            legajo:medico.legajo,
            especialidad:medico.especialidad.nombre,
            nombre:medico.persona.nombre,
            apellido:medico.persona.apellido,
        }));
        return medicos_info;
     } catch (error) {
        throw new Error('No ha sido posible buscar los médicos');
     }
        
    },
    obtener_info_medicos: async(req, res) => {
     try {
        const medicos_info=await obtener_datos_personales_medicos();
        if (!medicos_info) {
            return res.status(404).send({
                error:true,
                message:"no existen medicos"
            });
            
        }
        return res.status(200).send(medicos_info);
     } catch (error) {
        return res.status(500).send({
            error:true,
            message:"error al buscar los medicos"
        });
        
     }

    },

   
}
export default controller_medico;