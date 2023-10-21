import FabricaMedicos from '../factories/medicos.js'

class SemillaDeMedicos {
  run() {
    const fabricaMedicos = new FabricaMedicos()

    fabricaMedicos.setCount(5).create()
  }
}

export default SemillaDeMedicos