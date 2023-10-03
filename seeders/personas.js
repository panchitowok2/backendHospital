import FabricaDePersonas from '../factories/personas.js'

class SemillaDePersonas {
  run() {
    const fabricaDePersonas = new FabricaDePersonas()

    fabricaDePersonas.setCount(6).create()
  }
}

export default SemillaDePersonas