import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { getModel } from '@/lib/admin-models'
import { getCollection, canView, canEdit } from '@/lib/admin-collections'
import { requireRole, hashPassword } from '@/lib/auth'
import { postLinkToFacebook, isFacebookConfigured } from '@/lib/facebook'

export const runtime = 'nodejs'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const user = await requireRole()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { collection, id } = await params
  const Model = getModel(collection)
  if (!Model) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 })
  if (!canView(collection, user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await connectToDatabase()
  const projection = collection === 'adminusers' ? '-passwordHash' : undefined
  const doc = await Model.findById(id, projection).lean()
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ item: JSON.parse(JSON.stringify(doc)) })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const user = await requireRole(['admin', 'editor'])
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { collection, id } = await params
  const config = getCollection(collection)
  const Model = getModel(collection)
  if (!config || !Model) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 })
  if (!canEdit(collection, user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await connectToDatabase()
  const body = await req.json()
  delete body._id
  delete body.createdAt

  if (collection === 'adminusers') {
    if (user.role !== 'admin') return NextResponse.json({ error: 'Admins only' }, { status: 403 })
    if (body.password) {
      body.passwordHash = await hashPassword(String(body.password))
    }
    delete body.password
  }

  const doc = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean()
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Manual "Share to Facebook" from the blog editor.
  if (collection === 'posts' && body.shareToFacebook === true && isFacebookConfigured()) {
    try {
      const post = await Model.findById(id)
      const p = post as unknown as {
        title?: string; slug?: string; excerpt?: string; publishedAt?: unknown; facebookPostId?: string; save: () => Promise<unknown>
      }
      if (p && p.publishedAt && !p.facebookPostId) {
        const base = process.env.NEXT_PUBLIC_BASE_URL || 'https://nepatronix.org'
        const fbId = await postLinkToFacebook({
          message: [p.title, p.excerpt].filter(Boolean).join('\n\n'),
          link: `${base}/blog/${p.slug || ''}`,
        })
        if (fbId) {
          p.facebookPostId = fbId
          await p.save()
        }
      }
    } catch (err) {
      console.error('Facebook share error:', err)
    }
  }

  const obj = JSON.parse(JSON.stringify(doc)) as Record<string, unknown>
  delete obj.passwordHash
  return NextResponse.json({ item: obj })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  const user = await requireRole(['admin', 'editor'])
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { collection, id } = await params
  const Model = getModel(collection)
  if (!Model) return NextResponse.json({ error: 'Unknown collection' }, { status: 404 })
  if (!canEdit(collection, user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  await connectToDatabase()
  await Model.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
