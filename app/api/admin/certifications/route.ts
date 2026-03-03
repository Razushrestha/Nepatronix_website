import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { cookies } from 'next/headers'

export async function DELETE(req: NextRequest) {
  // Auth check
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (session !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  // Bulk delete by status
  if (body.status) {
    const docs = await client.fetch<{ _id: string }[]>(
      `*[_type == "certificationApplication" && status == $status]{ _id }`,
      { status: body.status }
    )
    await Promise.all(docs.map((d) => client.delete(d._id)))
    return NextResponse.json({ success: true, deleted: docs.length })
  }

  // Single delete by id
  const { id } = body
  if (!id) return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
  await client.delete(id)
  return NextResponse.json({ success: true })
}
