import { createClient } from 'next-sanity';
import { NextResponse } from 'next/server';

const readClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-01-01',
  useCdn: false,
});

// IMPORTANT: Secure this route with a secret key in your Sanity Webhook
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const secret = req.headers.get('x-sanity-secret');

    // Basic security check (You should set this in your environment variables)
    if (secret !== process.env.SANITY_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // This data comes from the Sanity Webhook payload
    const { title, slug, excerpt } = body;

    if (!title || !slug) {
      return NextResponse.json({ error: 'Missing blog information' }, { status: 400 });
    }

    // 1. Fetch all active subscribers
    const subscribers = await readClient.fetch(
      `*[_type == "subscriber" && status == "active"].email`
    );

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({ message: 'No subscribers to notify' });
    }

    console.log(`Preparing to notify ${subscribers.length} subscribers about: ${title}`);

    // 2. TRIGGER EMAIL SENDING
    // In a real-world scenario, you would use a service like Resend or SendGrid here.
    // Example with Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'Nepatronix <updates@nepatronix.com>',
    //   to: subscribers,
    //   subject: `New Post: ${title}`,
    //   html: `<p>${excerpt}</p><a href="https://nepatronix.com/blog/${slug}">Read more</a>`
    // });

    return NextResponse.json({ 
      message: 'Notification trigger received', 
      subscriberCount: subscribers.length 
    });

  } catch (error: any) {
    console.error('Notification error:', error);
    return NextResponse.json({ error: 'Failed to process notification' }, { status: 500 });
  }
}
