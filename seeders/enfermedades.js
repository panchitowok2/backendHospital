import FabricaDeEnfermedades from "../factories/enfermedades.js"

class SemillaDeEnfermedades {
  run() {
    const fabricaDeEnfermedades = new FabricaDeEnfermedades()

    fabricaDeEnfermedades.create()
  }
}

export default SemillaDeEnfermedades