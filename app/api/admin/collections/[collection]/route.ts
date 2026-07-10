import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { getModel } from '@/lib/admin-models'
import { getCollection, canView, canEdit } from '@/lib/admin-collections'
import { singletonKey } from '@/lib/singleton-keys'
import { requireRole } from '@/lib/auth'
import { hashPassword } from '@/lib/auth'
import { postLinkToFacebook, isFacebookConfigured } from '@/lib/facebook'

async function maybeShareToFacebook(post: {
  _id: unknown
  title?: string
  slug?: string
  excerpt?: string
  publishedAt?: unknown
  facebookPostId?: string
  save: () => Promise<unknown>
}) {
  if (!isFacebookConfigured()) return
  if (post.facebookPostId) return
  if (!post.publishedAt) return
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://nepatronix.org'
  const link = `${base}/blog/${post.slug || ''}`
  const message = [post.title, post.excerpt].filter(Boolean).join('\n\n')
  const id = await postLinkToFacebook({ message, link })
  if (id) {
    post.facebookPostId = id
    await post.save()
  }
}

export const runtime = 'nodejs'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const user = await requireRole()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { collection } = await params
  const config = getCollection(collection)
  const Model = getModel(collection)
  if (!config || !Model) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 })
  if (!canView(collection, user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await connectToDatabase()

  // Singleton: always return (and lazily create) the single document.
  if (config.singleton) {
    const key = singletonKey(collection)
    let doc = key ? await Model.findOne({ key }).lean() : await Model.findOne().lean()
    if (!doc) {
      doc = (await Model.create(key ? { key } : {})).toObject()
    }
    return NextResponse.json({ item: JSON.parse(JSON.stringify(doc)) })
  }

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.trim()
  const status = searchParams.get('status')?.trim()
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(200, Math.max(1, parseInt(searchParams.get('limit') || '25', 10)))
  const sort = searchParams.get('sort') || config.defaultSort || '-createdAt'

  const filter: Record<string, unknown> = {}
  if (q && config.searchFields?.length) {
    filter.$or = config.searchFields.map((f) => ({ [f]: { $regex: q, $options: 'i' } }))
  }
  if (status && config.statusField) {
    filter[config.statusField] = status
  }

  const projection = collection === 'adminusers' ? '-passwordHash' : undefined

  const [items, total] = await Promise.all([
    Model.find(filter, projection)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Model.countDocuments(filter),
  ])

  return NextResponse.json({
    items: JSON.parse(JSON.stringify(items)),
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> }
) {
  const user = await requireRole(['admin', 'editor'])
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { collection } = await params
  const config = getCollection(collection)
  const Model = getModel(collection)
  if (!config || !Model) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 })
  if (!canEdit(collection, user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await connectToDatabase()
  const body = await req.json()

  if (collection === 'adminusers') {
    if (user.role !== 'admin') return NextResponse.json({ error: 'Admins only' }, { status: 403 })
    if (body.password) {
      body.passwordHash = await hashPassword(String(body.password))
    }
    delete body.password
    if (!body.passwordHash) return NextResponse.json({ error: 'Password required' }, { status: 400 })
  }

  if (collection === 'partners' && !body.type) {
    body.type = 'trusted'
  }

  const created = await Model.create(body)

  // Auto-share newly published blog posts to Facebook.
  if (collection === 'posts' && body.shareToFacebook !== false) {
    try {
      await maybeShareToFacebook(created as never)
    } catch (err) {
      console.error('Facebook share error:', err)
    }
  }

  const obj = JSON.parse(JSON.stringify(created))
  delete obj.passwordHash
  return NextResponse.json({ item: obj }, { status: 201 })
}
