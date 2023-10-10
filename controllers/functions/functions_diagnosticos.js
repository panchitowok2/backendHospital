import Diagnostico from '../../models/diagnostico.js'

const functions = {
    buscarDiagnostico: async (params) => {
        const resultado = await Diagnostico.findOne({
            _id: params._id
        }).then(diagnosticoBuscado => {
            //si el diagnostico no pudo ser encontrado devuelve este error    
            //console.log('la funcion devuelve: ', diagnosticoBuscada)
            if (!diagnosticoBuscado) {
                //console.log('entro al if')
                return null;
            }
            //si la consulta fue encontrada devolvemos esto
            return diagnosticoBuscado
        }).catch(error => {
            return null;
        })
        return resultado;
    }
}
export default functions;