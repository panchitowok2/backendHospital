import FabricaDeTratamientosFarmacologicos from "../factories/tratamientos_farmacologicos.js"

class SemillaDeTratamientosFarmacologicos {
  run() {
    const fabricaDeTratamientosFarmacologicos = new FabricaDeTratamientosFarmacologicos()

    fabricaDeTratamientosFarmacologicos.setCount(5).create()
  }
}

export default SemillaDeTratamientosFarmacologicos