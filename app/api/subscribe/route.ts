import { createClient } from 'next-sanity';
import { NextResponse } from 'next/server';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN, // Requires a token with write access
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // Check if subscriber already exists
    const existing = await writeClient.fetch(
      `*[_type == "subscriber" && email == $email][0]`,
      { email }
    );

    if (existing) {
      return NextResponse.json({ message: 'Already subscribed' }, { status: 200 });
    }

    // Create new subscriber
    await writeClient.create({
      _type: 'subscriber',
      email,
      subscribedAt: new Date().toISOString(),
      status: 'active',
    });

    return NextResponse.json({ message: 'Subscribed successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
