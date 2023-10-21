import FabricaDeEspecialidades from "../factories/especialidades.js"

class SemillaDeEspecialidades {
  run() {
    const fabricaDeEspecialidades = new FabricaDeEspecialidades()

    fabricaDeEspecialidades.create()
  }
}

export default SemillaDeEspecialidades