import SemillaDePersonas from './personas.js'
import SemillaDeMedicos from './medicos.js'
import SemillaDeEnfermedades from './enfermedades.js'
import SemillaDeEspecialidades from './especialidades.js'
import SemillaDeMedicamentos from './medicamentos.js'
import SemillaDeDiagnosticos from './diagnosticos.js'
import SemillaConsultas from './consultas.js'
import SemillaDeDosificaciones from './dosificaciones.js'
import SemillaDeTratamientosFarmacologicos from './tratamientos_farmacologicos.js'
import SemillaDeTurnos from './turnos.js'


class SemillaDeBaseDeDatos {
  constructor() {

    this.semillaDeEnfermedades = new SemillaDeEnfermedades()
    this.semillaDeEspecialidades = new SemillaDeEspecialidades()
    this.semillaDeMedicamentos = new SemillaDeMedicamentos()
    this.semillaDeDosificaciones = new SemillaDeDosificaciones()
    this.semillaDePersonas = new SemillaDePersonas()
    this.semillaDeMedicos = new SemillaDeMedicos()
    this.semillaDeTurnos = new SemillaDeTurnos()
    this.semillaConsultas = new SemillaConsultas()
    this.semillaDeDiagnosticos = new SemillaDeDiagnosticos()
    this.semillaDeTratamientosFarmacologicos = new SemillaDeTratamientosFarmacologicos()

  }
  run() {
   // this.semillaDeEnfermedades.run()
   // this.semillaDeEspecialidades.run()
    //this.semillaDeMedicamentos.run()
    //this.semillaDeDosificaciones.run()
   //this.semillaDePersonas.run()
    //this.semillaDeMedicos.run()
    //this.semillaDeTurnos.run()
   //this.semillaConsultas.run()
   //this.semillaDeDiagnosticos.run()
    this.semillaDeTratamientosFarmacologicos.run()
    
  }
}

const semillaBaseDeDatos = new SemillaDeBaseDeDatos()
semillaBaseDeDatos.run()