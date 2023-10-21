import FabricarTurnos from "../factories/turnos.js"
class SemillaDeTurnos {
  run() {
    const fabricarTurnos = new FabricarTurnos()

    fabricarTurnos.setCount(5).create()
  }
}

export default SemillaDeTurnos