const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function checkDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB.");
    
    // Get the database name we are connected to
    console.log("Connected to database:", conn.connection.name);
    
    // List collections
    const collections = await conn.connection.db.listCollections().toArray();
    console.log("Collections in this DB:");
    for (const c of collections) {
      console.log(" - " + c.name);
    }
    
    // Check if products collection has items
    const productsCollection = conn.connection.db.collection('products');
    const count = await productsCollection.countDocuments();
    console.log(`The 'products' collection has ${count} documents.`);
    
    if (count > 0) {
        const sample = await productsCollection.findOne({});
        console.log("Sample product:", sample);
    }
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkDB();
