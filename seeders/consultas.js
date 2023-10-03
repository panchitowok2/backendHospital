import FabricaConsultas from "../factories/consultas.js"

class SemillaConsultas {
    run() {
        const fabricaConsultas = new FabricaConsultas()
        fabricaConsultas.setCount(5).create()
    }
}

export default SemillaConsultas