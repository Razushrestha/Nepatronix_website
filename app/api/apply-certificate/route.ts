import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

// Generate unique certificate UID: NT-YYYYMMDD-00000009 format
async function generateCertificateUID(): Promise<string> {
  const prefix = "NT";
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const count = await client.fetch<number>(
    `count(*[_type == "certificationApplication" && defined(certificateDetails.certificateUID)])`
  );
  const seq = (count + 1).toString().padStart(2, "0");
  return `${prefix}-${date}-${seq}`;
}

// Send email notification
async function sendEmailNotification(
  to: string,
  name: string,
  status: string,
  courseName: string,
  additionalInfo?: string
) {
  const templates = {
    pending: {
      subject: "Application Received - Pending Payment Verification",
      message: `Dear ${name},\n\nThank you for applying for "${courseName}".\n\nYour application has been received successfully. Our team will verify your payment details within 2-3 business days.\n\nApplication Status: Pending Payment Verification\n\nYou will receive another email once your payment is verified.\n\nBest regards,\nNepatronix Team`,
    },
    payment_verified: {
      subject: "Payment Verified - Application Approved",
      message: `Dear ${name},\n\nGreat news! Your payment for "${courseName}" has been verified successfully.\n\nYour application is now approved and your certificate will be generated shortly.\n\nApplication Status: Payment Verified\n\nBest regards,\nNepatronix Team`,
    },
    approved: {
      subject: "Application Approved - Certificate Generation",
      message: `Dear ${name},\n\nCongratulations! Your application for "${courseName}" has been approved.\n\nYour certificate is being generated and will be ready shortly. You will receive it via email once completed.\n\nApplication Status: Approved\n\nBest regards,\nNepatronix Team`,
    },
    certificate_generated: {
      subject: "🎓 Certificate Ready - Download Now",
      message: `Dear ${name},\n\nCongratulations! Your certificate for "${courseName}" has been generated successfully.\n\n${additionalInfo || ""}\n\nYou can download your certificate from the link provided above.\n\nCertificate Status: Generated\n\nBest regards,\nNepatronix Team`,
    },
    rejected: {
      subject: "Application Status Update",
      message: `Dear ${name},\n\nThank you for your interest in "${courseName}".\n\nUnfortunately, we cannot process your application at this time.\n\nReason: ${additionalInfo || "Please contact support for more information."}\n\nIf you have any questions, please don't hesitate to reach out to us.\n\nBest regards,\nNepatronix Team`,
    },
  };

  const template = templates[status as keyof typeof templates];
  if (!template) return;

  try {
    // Using EmailJS browser library in Node.js requires different approach
    // Send via your existing email API if available
    console.log(`📧 Email to ${to}: ${template.subject}`);
    
    // TODO: Integrate with your email service
    // For now, just log the email
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
}



export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      contactNumber,
      courseType,
      trainingHours,
      trainingDays,
      courseName,
      profileImage,
      paymentScreenshot,
    } = body;

    // Validate required fields
    if (!fullName || !email || !contactNumber || !courseType || !trainingHours || !trainingDays) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert base64 to buffer and upload to Sanity
    let profileImageAsset = null;
    if (profileImage) {
      try {
        const base64Data = profileImage.split(',')[1]; // Remove data:image/...;base64, prefix
        const buffer = Buffer.from(base64Data, 'base64');
        profileImageAsset = await client.assets.upload('image', buffer, {
          filename: `profile-${Date.now()}.jpg`
        });
      } catch (imgError) {
        console.error("Profile image upload error:", imgError);
      }
    }

    let paymentScreenshotAsset = null;
    if (paymentScreenshot) {
      try {
        const base64Data = paymentScreenshot.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        paymentScreenshotAsset = await client.assets.upload('image', buffer, {
          filename: `payment-${Date.now()}.jpg`
        });
      } catch (imgError) {
        console.error("Payment screenshot upload error:", imgError);
      }
    }

    // Create application in Sanity
    const applicationData: { _type: string; applicantName: string; email: string; phone: string; courseType: string; trainingHours: string; trainingDays: string; courseName: string; status: string; submittedAt: string; profileImage?: { _type: string; asset: { _type: string; _ref: string } }; paymentDetails?: { amount: number | null; paymentMethod: string; paymentDate: string; paymentProof?: { _type: string; asset: { _type: string; _ref: string } } }; certificateDetails?: { certificateUID: string } } = {
      _type: "certificationApplication",
      applicantName: fullName,
      email,
      phone: contactNumber,
      courseType,
      trainingHours,
      trainingDays,
      courseName: courseName || `${trainingHours} hours / ${trainingDays} days course`,
      status: "pending",
      submittedAt: new Date().toISOString(),
    };

    // Add profile image if uploaded
    if (profileImageAsset) {
      applicationData.profileImage = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: profileImageAsset._id,
        },
      };
    }

    // Add payment details
    applicationData.paymentDetails = {
      amount: courseType === 'free' ? 0 : null,
      paymentMethod: "Pending",
      paymentDate: new Date().toISOString(),
    };

    // Add payment screenshot if uploaded
    if (paymentScreenshotAsset) {
      applicationData.paymentDetails.paymentProof = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: paymentScreenshotAsset._id,
        },
      };
    }

    // Auto-generate certificate UID at submission time
    const certificateUID = await generateCertificateUID();
    applicationData.certificateDetails = {
      certificateUID,
    };

    const application = await client.create(applicationData);

    // Send pending status email
    await sendEmailNotification(
      email,
      fullName,
      "pending",
      courseName || "Selected Course"
    );

    return NextResponse.json({
      success: true,
      applicationId: application._id,
      message: "Application submitted successfully! Check your email for confirmation.",
    });
  } catch (error) {
    console.error("❌ Error creating application:", error);
    return NextResponse.json(
      { error: "Failed to submit application", details: String(error) },
      { status: 500 }
    );
  }
}
