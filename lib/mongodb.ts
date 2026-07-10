import mongoose from 'mongoose'

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nepatronix'

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

/**
 * Cache the connection across hot reloads in dev and across serverless
 * invocations in production so we don't open a new connection on every request.
 */
interface MongooseCache {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoose: MongooseCache | undefined
}

const cached: MongooseCache = global._mongoose || { conn: null, promise: null }

if (!global._mongoose) {
  global._mongoose = cached
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
      })
      .then((m) => m)
  }

  try {
    cached.conn = await cached.promise
  } catch (err) {
    cached.promise = null
    throw err
  }

  return cached.conn
}

export default connectToDatabase
