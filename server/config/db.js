const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/serra_savona';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`🍃 Connessione MongoDB stabilita con successo: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ Attenzione: Impossibile connettersi a MongoDB (${error.message}).`);
    console.warn(`ℹ️ Assicurati che MONGODB_URI sia configurato correttamente nel file .env.`);
    isConnected = false;
  }
};

const getDbStatus = () => ({
  isConnected,
  readyState: mongoose.connection.readyState,
  host: mongoose.connection.host || 'N/A'
});

module.exports = { connectDB, getDbStatus };
