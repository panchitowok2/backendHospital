import FabricaDiagnosticos from "../factories/diagnosticos.js"

class SemillaDeDiagnosticos {
  run() {
    const fabricaDiagnosticos = new FabricaDiagnosticos()

    fabricaDiagnosticos.setCount(5).create()
  }
}

export default SemillaDeDiagnosticos