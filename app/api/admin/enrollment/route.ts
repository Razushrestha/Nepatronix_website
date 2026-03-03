import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'

export async function PATCH(req: NextRequest) {
  const { id, status, notes } = await req.json()

  if (!id || !status) {
    return NextResponse.json({ error: 'Missing id or status' }, { status: 400 })
  }

  await client.patch(id).set({ status, notes }).commit()
  return NextResponse.json({ success: true })
}
