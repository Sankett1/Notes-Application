import mongoose from 'mongoose';

export const connectDB = async () => {
  // fall back to local database if MONGODB_URI not set
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-app';
  if (!process.env.MONGODB_URI) {
    console.warn('⚠️ Using default MongoDB URI: mongodb://localhost:27017/notes-app');
  }
  try {
    // mongoose v6+ uses newer parser/ topology by default, options deprecated
    const conn = await mongoose.connect(uri);

    console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error('✗ Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('✓ MongoDB Disconnected');
  } catch (error) {
    console.error('✗ Error disconnecting from MongoDB:', error.message);
    process.exit(1);
  }
};
