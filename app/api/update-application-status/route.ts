import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { Certification } from "@/lib/models";

async function sendStatusEmail(
  email: string,
  name: string,
  status: string,
  courseName: string,
  notes?: string
) {
  const templates = {
    payment_verified: {
      subject: "Payment Verified",
      message: `Dear ${name},\n\nYour payment for "${courseName}" has been verified.\n\nYour application is now under admin review for certificate generation.\n\nBest regards,\nNepatronix Team`,
    },
    approved: {
      subject: "Application Approved",
      message: `Dear ${name},\n\nCongratulations! Your application for "${courseName}" has been approved.\n\nYour certificate will be generated shortly.\n\nBest regards,\nNepatronix Team`,
    },
    rejected: {
      subject: "Application Status Update",
      message: `Dear ${name},\n\nRegarding your application for "${courseName}".\n\nReason: ${notes || "Please contact support for details."}\n\nBest regards,\nNepatronix Team`,
    },
  };

  const template = templates[status as keyof typeof templates];
  if (!template) return;

  console.log(`Email to ${email}: ${template.subject}`);
}

export async function POST(req: NextRequest) {
  try {
    const { applicationId, status, rejectionReason } = await req.json();

    await connectToDatabase();
    const application = await Certification.findById(applicationId).lean<{
      applicantName?: string;
      email?: string;
      courseName?: string;
    }>();

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    await Certification.findByIdAndUpdate(applicationId, { status });

    await sendStatusEmail(
      application.email || "",
      application.applicantName || "",
      status,
      application.courseName || "",
      rejectionReason
    );

    let certificateUID: string | undefined;
    if (status === "approved") {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/generate-certificate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId }),
        });

        const result = await response.json();
        if (result.success) {
          certificateUID = result.certificateUID;
        } else {
          console.error("Certificate generation failed:", result.error);
        }
      } catch (error) {
        console.error("Error triggering certificate generation:", error);
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
