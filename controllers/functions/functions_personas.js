import Persona from '../../models/persona.js'

const functions = {
    buscarPersona: async (params) => {
        const resultado = await Persona.findOne({
            tipo_documento: params.tipo_documento,
            documento: params.documento,
            sexo: params.sexo,
            apellido: params.apellido
        }).then(personaBuscada => {
            //si la persona no pude ser encontrada devuelve este error    
            //console.log('la funcion devuelve: ', personaBuscada)
            if (!personaBuscada) {
                //console.log('entro al if')
                return null;
            }
            //si la persona fue encontrada devolvemos esto
            return personaBuscada
        }).catch(error => {
            return null;
        })
        return resultado;
    }
}
export default functions;