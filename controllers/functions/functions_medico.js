import Medico from '../../models/medico.js'

const functions = {
    buscarMedico: async (params) => {
        const resultado = await Medico.findOne({
            _id: params._id
        }).then(medicoBuscado => {
            //si el medico no pudo ser encontrado devuelve este error    
            //console.log('la funcion devuelve: ', medicoBuscadp)
            if (!medicoBuscado) {
                //console.log('entro al if')
                return null;
            }
            //si la consulta fue encontrada devolvemos esto
            return medicoBuscado
        }).catch(error => {
            return null;
        })
        return resultado;
    }
}
export default functions;