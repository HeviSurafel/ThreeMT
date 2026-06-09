// lib/db/mongodb.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://surafelwondu5647_db_user:HM0KCSaOVkiYsMPi@ac-hfr26ho-shard-00-00.nnqpokt.mongodb.net:27017,ac-hfr26ho-shard-00-01.nnqpokt.mongodb.net:27017,ac-hfr26ho-shard-00-02.nnqpokt.mongodb.net:27017/?ssl=true&replicaSet=atlas-glx8ch-shard-0&authSource=admin&appName=ThreeMT';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}