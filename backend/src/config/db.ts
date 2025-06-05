// backend/src/config/db.ts
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URI as string);
    console.log(`🌿[database]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    console.error(`❌[database]: Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;