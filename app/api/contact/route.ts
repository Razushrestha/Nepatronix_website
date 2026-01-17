import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    const client = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
      token: process.env.SANITY_API_TOKEN,
      useCdn: false,
      apiVersion: '2024-01-01',
    });

    await client.create({
        _type: 'contactForm',
        name,
        email,
        phone,
        message,
        status: 'new'
    });

    return NextResponse.json({ message: 'Form submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ message: 'Error submitting form' }, { status: 500 });
  }
}
