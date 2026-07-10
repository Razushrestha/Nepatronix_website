import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Subscriber } from '@/lib/models';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const secret = req.headers.get('x-webhook-secret');

    if (secret !== process.env.BLOG_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, slug, excerpt } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Missing blog information' }, { status: 400 });
    }

    await connectToDatabase();
    const subscribers = await Subscriber.find({ status: 'active' })
      .select('email')
      .lean<{ email: string }[]>();

    if (!subscribers.length) {
      return NextResponse.json({ message: 'No subscribers to notify' });
    }

    console.log(`Preparing to notify ${subscribers.length} subscribers about: ${title}`);

    return NextResponse.json({
      message: 'Notification trigger received',
      subscriberCount: subscribers.length,
      excerpt,
      slug,
    });
  } catch (error: unknown) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
  }
}
