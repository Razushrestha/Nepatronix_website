import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/lib/models';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    await Subscriber.create({ email, status: 'active', subscribedAt: new Date() });

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
