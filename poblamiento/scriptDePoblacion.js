const mongoose = require('mongoose');

// Configuración de la conexión a MongoDB
mongoose.connect('mongodb://localhost/tu-base-de-datos', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB.');
});


// Datos de ejemplo
const datosDeEjemplo = [
  {
    nombre: 'Ejemplo 1',
    correo: 'ejemplo1@example.com',
    // Otros campos...
  },
  {
    nombre: 'Ejemplo 2',
    correo: 'ejemplo2@example.com',
    // Otros campos...
  },
  // Agrega más datos de ejemplo según sea necesario.
];

// Función para poblar la base de datos
const poblarBaseDeDatos = async () => {
  try {
    // Eliminar todos los registros existentes (opcional)
    await Usuario.deleteMany();

    // Crear nuevos registros
    await Usuario.create(datosDeEjemplo);

    console.log('Datos poblados con éxito.');
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecuta la función para poblar la base de datos
poblarBaseDeDatos();
