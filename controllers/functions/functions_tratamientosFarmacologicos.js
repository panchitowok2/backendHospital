import TratamientoFarmacologico from '../../models/tratamiento_farmacologico.js'

const functions = {
    buscarTratamientoFarmacologico: async (params) => {
        const resultado = await TratamientoFarmacologico.findOne({
            _id: params._id
        }).then(tratamientoBuscado => {
            //si TF no pudo ser encontrad devuelve este error    
            //console.log('la funcion devuelve: ', tratamientoBuscado)
            if (!tratamientoBuscado) {
                //console.log('entro al if')
                return null;
            }
            //si el TF fue encontrado devolvemos esto
            return tratamientoBuscado
        }).catch(error => {
            return null;
        })
        return resultado;
    }
}
export default functions;