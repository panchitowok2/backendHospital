import FabricaDeDosificaciones from "../factories/dosificaciones.js"

class SemillaDeDosificaciones {
  run() {
    const fabricaDeDosificaciones = new FabricaDeDosificaciones()

    fabricaDeDosificaciones.setCount(5).create()
  }
}

export default SemillaDeDosificaciones