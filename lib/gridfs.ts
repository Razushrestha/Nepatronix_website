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
  return uploadReadable(Readable.from(buffer), filename, contentType)
}

/** Stream upload — avoids loading large videos entirely into memory. */
export async function uploadReadable(
  source: Readable,
  filename: string,
  contentType: string
): Promise<string> {
  const bucket = await getBucket()
  return new Promise<string>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: { uploadedAt: new Date() },
    })
    source
      .pipe(uploadStream)
      .on('error', reject)
      .on('finish', () => resolve(uploadStream.id.toString()))
  })
}

/** Upload from a Fetch/Web ReadableStream (task video uploads). */
export async function uploadWebStream(
  webStream: ReadableStream<Uint8Array>,
  filename: string,
  contentType: string
): Promise<string> {
  const nodeStream = Readable.fromWeb(webStream as Parameters<typeof Readable.fromWeb>[0])
  return uploadReadable(nodeStream, filename, contentType)
}

export interface GridFile {
  stream: NodeJS.ReadableStream
  contentType: string
  length: number
  filename: string
}

export interface GridFileRange extends GridFile {
  rangeStart: number
  rangeEnd: number
}

/**
 * Open a download stream for a stored file, or null if not found.
 * Optional byte range for video seeking (HTTP Range requests).
 */
export async function getFile(
  id: string,
  range?: { start: number; end: number }
): Promise<GridFile | GridFileRange | null> {
  if (!ObjectId.isValid(id)) return null
  const bucket = await getBucket()
  const _id = new ObjectId(id)
  const files = await bucket.find({ _id }).toArray()
  if (!files.length) return null
  const file = files[0]
  const stream = range
    ? bucket.openDownloadStream(_id, { start: range.start, end: range.end + 1 })
    : bucket.openDownloadStream(_id)
  const base = {
    stream,
    contentType: file.contentType || 'application/octet-stream',
    length: file.length,
    filename: file.filename,
  }
  if (range) {
    return { ...base, rangeStart: range.start, rangeEnd: range.end }
  }
  return base
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
