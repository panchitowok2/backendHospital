import FabricaDeMedicametos from "../factories/medicamentos.js"

class SemillaDeMedicamentos {
  run() {
    const fabricaDeMedicametos = new FabricaDeMedicametos()

    fabricaDeMedicametos.create()
  }
}

export default SemillaDeMedicamentos