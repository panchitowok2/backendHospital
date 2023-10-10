import Consulta from '../../models/consulta.js'

const functions = {
    buscarConsulta: async (params) => {
        const resultado = await Consulta.findOne({
            _id: params._id
        }).then(consultaBuscada => {
            //si la consulta no pude ser encontrada devuelve este error    
            //console.log('la funcion devuelve: ', consultaBuscada)
            if (!consultaBuscada) {
                //console.log('entro al if')
                return null;
            }
            //si la consulta fue encontrada devolvemos esto
            return consultaBuscada
        }).catch(error => {
            return null;
        })
        return resultado;
    }
}
export default functions;