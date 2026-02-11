import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from 'next-sanity';

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, phone, organization, message, courseName, coursePrice } = await req.json();

    // Validate required fields
    if (!fullName || !email || !phone || !courseName) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    let sanitySuccess = false;
    let emailSuccess = false;

    // Send email using Web3Forms FIRST (more reliable)
    try {
      const web3FormsResponse = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: process.env.WEB3FORMS_KEY,
          subject: `🎓 New Course Enrollment - ${courseName}`,
          from_name: 'Nepatronix Website',
          replyto: email,
          // Form data
          "Full Name": fullName,
          "Email": email,
          "Phone": phone,
          "Organization": organization || 'Not specified',
          "Course": courseName,
          "Price": coursePrice,
          "Message": message || 'No message',
          "Submitted At": new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' }) + ' (Nepal Time)',
        }),
      });

      const emailResult = await web3FormsResponse.json();
      console.log('Web3Forms response:', emailResult);
      
      if (web3FormsResponse.ok && emailResult.success) {
        emailSuccess = true;
      }
    } catch (emailError) {
      console.error('Email error:', emailError);
    }

    // Save to Sanity (optional - if token has write permissions)
    try {
      if (process.env.SANITY_API_TOKEN) {
        const client = createClient({
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
          token: process.env.SANITY_API_TOKEN,
          useCdn: false,
          apiVersion: '2024-01-01',
        });

        await client.create({
          _type: 'enrollment',
          fullName,
          email,
          phone,
          organization: organization || '',
          message: message || '',
          courseName,
          coursePrice,
          status: 'pending',
          createdAt: new Date().toISOString(),
        });
        sanitySuccess = true;
        console.log('Sanity: Enrollment saved successfully');
      }
    } catch (sanityError) {
      console.error('Sanity error (not critical):', sanityError);
      // Continue - email is more important
    }

    // Return success if email was sent (primary goal)
    if (emailSuccess) {
      return NextResponse.json(
        { message: 'Enrollment request submitted successfully', sanity: sanitySuccess },
        { status: 200 }
      );
    }

    // If email failed but sanity worked
    if (sanitySuccess) {
      return NextResponse.json(
        { message: 'Enrollment saved but email notification failed' },
        { status: 200 }
      );
    }

    // If both failed
    return NextResponse.json(
      { message: 'Error submitting enrollment request. Please contact us directly.' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Enrollment submission error:', error);
    return NextResponse.json(
      { message: 'Error submitting enrollment request' },
      { status: 500 }
    );
  }
}
