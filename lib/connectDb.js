import mongoose from 'mongoose';

// eslint-disable-next-line no-undef
const MONGO_URI = process.env.VITE_MONGO_URI;

if (!MONGO_URI) {
  throw new Error('MongoDB URI is missing in environment variables.');
}

export const connectDb = async () => {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    throw new Error('Database connection failed');
  }
};
