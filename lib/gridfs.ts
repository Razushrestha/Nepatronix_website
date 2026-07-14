import { GridFSBucket, ObjectId } from 'mongodb'
import { Readable } from 'stream'
import { connectToDatabase } from './mongodb'
import mongoose from 'mongoose'

const BUCKET_NAME = 'uploads'

async function getBucket(): Promise<GridFSBucket> {
  await connectToDatabase()
  const db = mongoose.connection.db
  if (!db) {
    throw new Error('MongoDB is not connected — check MONGODB_URI on the server')
  }
  return new GridFSBucket(db, { bucketName: BUCKET_NAME })
}

/**
 * Store a buffer in GridFS and return the resulting file id as a string.
 */
export async function uploadBuffer(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<string> {
  const bucket = await getBucket()
  return new Promise<string>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: { uploadedAt: new Date() },
    })
    Readable.from(buffer)
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve(uploadStream.id.toString()))
  })
}

export interface GridFile {
  stream: NodeJS.ReadableStream
  contentType: string
  length: number
  filename: string
}

/**
 * Open a download stream for a stored file, or null if not found.
 */
export async function getFile(id: string): Promise<GridFile | null> {
  if (!ObjectId.isValid(id)) return null
  const bucket = await getBucket()
  const _id = new ObjectId(id)
  const files = await bucket.find({ _id }).toArray()
  if (!files.length) return null
  const file = files[0]
  return {
    stream: bucket.openDownloadStream(_id),
    contentType: file.contentType || 'application/octet-stream',
    length: file.length,
    filename: file.filename,
  }
}

export async function deleteFile(id: string): Promise<void> {
  if (!ObjectId.isValid(id)) return
  const bucket = await getBucket()
  try {
    await bucket.delete(new ObjectId(id))
  } catch {
    // ignore missing files
  }
}

/** Build the public URL used to serve a stored file. */
export function fileUrl(id?: string | null): string {
  if (!id) return ''
  return `/api/files/${id}`
}
