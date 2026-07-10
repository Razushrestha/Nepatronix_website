import { type NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ContactForm } from '@/lib/models';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    await connectToDatabase();
    await ContactForm.create({ name, email, phone, message, status: 'new' });

    return NextResponse.json({ message: 'Form submitted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Submission error:', error);
    return NextResponse.json({ message: 'Error submitting form' }, { status: 500 });
  }
}
