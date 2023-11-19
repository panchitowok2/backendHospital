beforeEach(async () => {
    // Conéctate a tu base de datos original
    const client = new MongoClient('mongodb+srv://usuario:contraseña@cluster0.mongodb.net/nombre-de-tu-base-de-datos-original?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client.connect();
  
    // Crea una copia de seguridad de tu base de datos original
    const db = client.db('nombre-de-tu-base-de-datos-original');
    const collections = await db.collections();
    const backup = {};
  
    for (const collection of collections) {
      const data = await collection.find().toArray();
      backup[collection.collectionName] = data;
    }
  
    await client.close();
  
    // Conéctate a tu base de datos de pruebas
    const client2 = new MongoClient('mongodb+srv://usuario:contraseña@cluster0.mongodb.net/nombre-de-tu-base-de-datos-de-pruebas?retryWrites=true&w=majority', { useUnifiedTopology: true });
    await client2.connect();
  
    // Restaura la copia de seguridad en tu base de datos de pruebas
    const db2 = client2.db('nombre-de-tu-base-de-datos-de-pruebas');
  
    for (const collectionName in backup) {
      const collectionData = backup[collectionName];
      await db2.collection(collectionName).insertMany(collectionData);
    }
  
    await client2.close();
  });
  