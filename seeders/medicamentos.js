import mongoose from 'mongoose'
import {url} from '../config.js'
import Medicamento from '../models/medicamento.js'

mongoose.connect(url).then(async () => {
  console.log('Conexion a la base de datos establecida')
    
  const medicamentos = [
    {
        droga: "Paracetamol",
        nombre: "Tylenol",
        presentacion: "Tabletas"
    },
    {
        droga: "Ibuprofeno",
        nombre: "Advil",
        presentacion: "Cápsulas"
    },
    {
        droga: "Omeprazol",
        nombre: "Prilosec",
        presentacion: "Cápsulas"
    },
    {
        droga: "Simvastatina",
        nombre: "Zocor",
        presentacion: "Tabletas"
    },
    {
        droga: "Amoxicilina",
        nombre: "Amoxil",
        presentacion: "Suspensión Oral"
    },
    {
        droga: "Loratadina",
        nombre: "Claritin",
        presentacion: "Tabletas"
    },
    {
        droga: "Diazepam",
        nombre: "Valium",
        presentacion: "Tabletas"
    },
    {
        droga: "Ciprofloxacino",
        nombre: "Cipro",
        presentacion: "Tabletas"
    }
  ];

  for (const medicamento of medicamentos) {
    const nuevoMedicamento = new Medicamento(medicamento);
    await nuevoMedicamento.save();
    
    console.log(`Medicamento "${medicamento.droga}" insertado.`);
  }

  mongoose.disconnect();
  console.log('Conexión cerrada.');
}).catch(error => {
  console.error('Error al conectar a la base de datos:', error);
});