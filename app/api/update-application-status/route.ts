import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

// Status change email notification (simplified for now)
async function sendStatusEmail(
  email: string,
  name: string,
  status: string,
  courseName: string,
  notes?: string
) {
  const templates = {
    payment_verified: {
      subject: "✅ Payment Verified",
      message: `Dear ${name},\n\nYour payment for "${courseName}" has been verified.\n\nYour application is now under admin review for certificate generation.\n\nBest regards,\nNepatronix Team`,
    },
    approved: {
      subject: "🎓 Application Approved",
      message: `Dear ${name},\n\nCongratulations! Your application for "${courseName}" has been approved.\n\nYour certificate will be generated shortly.\n\nBest regards,\nNepatronix Team`,
    },
    rejected: {
      subject: "Application Status Update",
      message: `Dear ${name},\n\nRegarding your application for "${courseName}".\n\nReason: ${notes || "Please contact support for details."}\n\nBest regards,\nNepatronix Team`,
    },
  };

  const template = templates[status as keyof typeof templates];
  if (!template) return;

  console.log(`📧 Email to ${email}: ${template.subject}`);
  // TODO: Integrate with your email service
}

export async function POST(req: NextRequest) {
  try {
    const { applicationId, status, rejectionReason } = await req.json();

    // Fetch application
    const application = await client.fetch(
      `*[_type == "certificationApplication" && _id == $applicationId][0]{
        _id,
        applicantName,
        email,
        courseName
      }`,
      { applicationId }
    );

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    // Update status
    await client
      .patch(applicationId)
      .set({ status })
      .commit();

    // Send status change email
    await sendStatusEmail(
      application.email,
      application.applicantName,
      status,
      application.courseName,
      rejectionReason
    );

    // Auto-trigger certificate generation on approval
    let certificateUID: string | undefined
    if (status === "approved") {
      try {
        console.log(`🎓 Triggering certificate generation for application ${applicationId}`);
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/generate-certificate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId }),
        });
        
        const result = await response.json();
        if (result.success) {
          certificateUID = result.certificateUID;
          console.log(`✅ Certificate generated successfully: ${certificateUID}`);
        } else {
          console.error(`❌ Certificate generation failed:`, result.error);
        }
      } catch (error) {
        console.error("❌ Error triggering certificate generation:", error);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application ${status} successfully`,
      ...(certificateUID ? { certificateUID } : {}),
    });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
