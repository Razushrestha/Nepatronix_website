import { type NextRequest, NextResponse } from 'next/server'
import { loadChatKnowledge } from '@/lib/chatbot/load-knowledge'
import { generateChatReply } from '@/lib/chatbot/responder'
import type { ChatMessage } from '@/lib/chatbot/types'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const message = String(body.message || '').trim()
    const history: ChatMessage[] = Array.isArray(body.history)
      ? body.history
          .filter((m: { role?: string; text?: string }) => m?.role && m?.text)
          .slice(-8)
          .map((m: { role: string; text: string }) => ({
            role: m.role === 'user' ? 'user' : 'bot',
            text: String(m.text),
          }))
      : []

    if (!message) {
      return NextResponse.json(
        { text: 'Please type a message so I can help you.', intent: 'empty', confidence: 0 },
        { status: 400 }
      )
    }

    const knowledge = await loadChatKnowledge()
    const reply = generateChatReply(knowledge, message, history)

    return NextResponse.json(reply, { status: 200 })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        text: "I'm having a brief technical issue. Please try again, or contact us at info@nepatronix.org or +977-9803661701.",
        intent: 'error',
        confidence: 0,
      },
      { status: 500 }
    )
  }
}
