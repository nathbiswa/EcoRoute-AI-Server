import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async (): Promise<void> => {
  const RETRY_DELAY_MS = 5000;

  const tryConnect = async (): Promise<void> => {
    try {
      const conn = await mongoose.connect(process.env.MONGODB_URI as string, {
        dbName: 'EcoRouteAI',            // ✅ Always connect to EcoRouteAI database
        serverSelectionTimeoutMS: 10000, // Timeout after 10s per attempt
      });

      console.log(`✅ MongoDB Connected`);
      console.log(`   Host     : ${conn.connection.host}`);
      console.log(`   Database : ${conn.connection.name}`);
    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ MongoDB Connection Failed: ${error.message}`);
      } else {
        console.error('❌ MongoDB Connection Failed: Unknown error');
      }
      console.log(`🔄 Retrying MongoDB connection in ${RETRY_DELAY_MS / 1000}s...`);
      // Retry after delay — server stays alive, Express keeps running
      setTimeout(tryConnect, RETRY_DELAY_MS);
    }
  };

  await tryConnect();
};

export default connectDB;