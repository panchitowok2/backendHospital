import Dosificacion from '../../models/dosificacion.js'

const functions = {
    buscarDosificacion: async (params) => {
        const resultado = await Dosificacion.findOne({
            _id: params._id
        }).then(dosificacionBuscada => {
            //si la dosificacion no pude ser encontrada devuelve este error    
            //console.log('la funcion devuelve: ', dosificacionBuscada)
            if (!dosificacionBuscada) {
                //console.log('entro al if')
                return null;
            }
            //si la dosificacion fue encontrada devolvemos esto
            return dosificacionBuscada
        }).catch(error => {
            return null;
        })
        return resultado;
    }
}
export default functions;