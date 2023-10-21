import mongoose from 'mongoose'
import TratamientoFarmacologico from '../models/tratamiento_farmacologico.js'

var controller = {
    /* Funcion para buscar medicamentos mas recetados

    select medicamento.id, medicamento.nombre, count(*)
    from tratamiento_farmacologico
    inner join medico on tratamiento_farmacologico.medico_id = medico .id
    inner join especialidad on medico.especialidad_id = especialidad.id
    inner join dosificacion on tratamiento_farmacologico.id = dosificacion.tratamiento_farmacologico_id
    inner join medicamento on dosificacion.medicamento_id = medicamento.id
    where especialidad.id = $especialidadId and tratamiento_farmacologico.fecha between $fechaInicio and $fechaFinal 
    group by medicamento.id, medicamento.nombre
    */
    buscarMedicamentosMasRecetados: (req, res) => {

      },
     
}

export default controller


