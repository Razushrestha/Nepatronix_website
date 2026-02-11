import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import QRCode from "qrcode";

// Generate unique certificate UID
function generateCertificateUID(): string {
  const prefix = "NT";
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, "0");
  return `${prefix}-${year}-${random}`;
}

// Generate QR code as data URL
async function generateQRCode(data: string): Promise<string> {
  try {
    return await QRCode.toDataURL(data, {
      width: 300,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
  } catch (error) {
    console.error("Error generating QR code:", error);
    return "";
  }
}

// For now, we'll create a simple certificate generation
// In production, you can add Puppeteer for PDF generation
async function generateCertificateHTML(data: {
  recipientName: string;
  courseName: string;
  courseHours: string;
  courseDays: string;
  certificateUID: string;
  organizationName: string;
  issueDate: string;
  profileImageUrl?: string;
  qrCodeDataUrl?: string;
  signatoryName: string;
  signatoryTitle: string;
}): Promise<string> {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { margin: 0; padding: 0; font-family: Georgia, serif; }
  </style>
</head>
<body>
  <div style="width: 1123px; height: 794px; padding: 60px; position: relative; background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border: 12px solid #C1121F;">
    <!-- Top: Nepatronix Logo -->
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="https://nepatronix.com/logo.png" alt="Nepatronix" style="height: 80px; object-fit: contain;" />
    </div>

    <!-- Main Content Container -->
    <div style="display: flex; gap: 40px; align-items: flex-start;">
      <!-- Left: Circular Profile Image -->
      <div style="flex: 0 0 180px;">
        ${data.profileImageUrl ? `<img src="${data.profileImageUrl}" alt="${data.recipientName}" style="width: 180px; height: 180px; border-radius: 50%; object-fit: cover; border: 6px solid #C1121F; box-shadow: 0 4px 12px rgba(193, 18, 31, 0.3);" />` : ''}
      </div>

      <!-- Center: Certificate Content -->
      <div style="flex: 1; padding-top: 20px;">
        <h1 style="font-size: 48px; color: #C1121F; text-align: center; margin-bottom: 20px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px;">
          Certificate of Completion
        </h1>

        <div style="font-size: 16px; line-height: 1.8; color: #333; text-align: center; max-width: 600px; margin: 0 auto;">
          <p style="margin-bottom: 20px;">
            This is to certify that 
            <strong style="font-size: 24px; color: #C1121F;">${data.recipientName}</strong> 
            has successfully completed the 
            <strong>${data.courseHours} hours / ${data.courseDays} days</strong> 
            professional course titled
          </p>

          <p style="font-size: 22px; font-weight: bold; color: #C1121F; margin: 20px 0;">
            "${data.courseName}"
          </p>

          <p style="margin-bottom: 30px;">
            conducted by <strong>${data.organizationName}</strong>.
          </p>

          <p style="font-size: 14px; font-style: italic; color: #666;">
            During the course, the participant demonstrated dedication,
            commitment, and a clear understanding of the concepts covered,
            meeting all the prescribed requirements of the program.
          </p>
        </div>
      </div>

      <!-- Right: QR Code + UID -->
      <div style="flex: 0 0 180px; text-align: center;">
        ${data.qrCodeDataUrl ? `
          <img src="${data.qrCodeDataUrl}" alt="Verification QR" style="width: 150px; height: 150px; border: 4px solid #C1121F; padding: 8px; background: white;" />
          <p style="margin-top: 10px; font-size: 12px; font-weight: bold; color: #C1121F; word-break: break-word;">${data.certificateUID}</p>
        ` : ''}
      </div>
    </div>

    <!-- Bottom: Signature -->
    <div style="position: absolute; bottom: 60px; left: 60px; right: 60px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div style="text-align: left;">
        <p style="font-size: 12px; color: #666; margin-bottom: 5px;">
          Issue Date: ${new Date(data.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div style="text-align: center; border-top: 2px solid #333; padding-top: 10px; min-width: 200px;">
        <p style="font-size: 16px; font-weight: bold; margin-bottom: 4px;">
          ${data.signatoryName}
        </p>
        <p style="font-size: 12px; color: #666;">
          ${data.signatoryTitle}
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function POST(req: NextRequest) {
  try {
    const { applicationId } = await req.json();

    console.log(`📜 Certificate generation requested for application: ${applicationId}`);

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    // Fetch application details
    console.log(`🔍 Fetching application details from Sanity...`);
    const application = await client.fetch(
      `*[_type == "certificationApplication" && _id == $applicationId][0]{
        _id,
        applicantName,
        email,
        phone,
        status,
        courseName,
        trainingHours,
        trainingDays,
        "profileImageUrl": profileImage.asset->url
      }`,
      { applicationId }
    );

    if (!application) {
      console.error(`❌ Application not found: ${applicationId}`);
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    console.log(`✅ Application found: ${application.applicantName}`);
    console.log(`   - Status: ${application.status}`);
    console.log(`   - Course: ${application.courseName}`);

    if (application.status !== "approved") {
      console.warn(`⚠️ Application not approved yet. Current status: ${application.status}`);
      return NextResponse.json(
        { error: "Application must be approved before generating certificate" },
        { status: 400 }
      );
    }

    // Generate certificate details
    console.log(`🎨 Generating certificate details...`);
    const certificateUID = generateCertificateUID();
    const issueDate = new Date().toISOString().split("T")[0];
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nepatronix.com'}/verify-certificate/${certificateUID}`;

    // Generate QR code with comprehensive verification data
    // Automatically captures all student-entered information
    const qrData = JSON.stringify({
      certificateUID: certificateUID,
      fullName: application.applicantName,
      email: application.email,
      phone: application.phone,
      courseName: application.courseName,
      trainingHours: application.trainingHours,
      trainingDays: application.trainingDays,
      issueDate: issueDate,
      verificationUrl: verificationUrl,
      organization: "Nepatronix",
      issuedBy: "Nepatronix IoT & Robotics Training Center",
    });
    const qrCodeDataUrl = await generateQRCode(qrData);

    // Generate certificate HTML
    const certificateHTML = await generateCertificateHTML({
      recipientName: application.applicantName,
      courseName: application.courseName,
      courseHours: application.trainingHours,
      courseDays: application.trainingDays,
      certificateUID,
      organizationName: "Nepatronix",
      issueDate,
      profileImageUrl: application.profileImageUrl,
      qrCodeDataUrl,
      signatoryName: process.env.SIGNATORY_NAME || "Director Name",
      signatoryTitle: process.env.SIGNATORY_TITLE || "Director, Nepatronix",
    });

    // For now, store the HTML. In production, convert to PDF using Puppeteer
    // You can add PDF generation later with: npm install puppeteer

    // Update application with certificate details
    console.log(`💾 Saving certificate details to Sanity for UID: ${certificateUID}`);
    await client
      .patch(applicationId)
      .set({
        status: "certificate_generated",
        certificateDetails: {
          certificateUID,
          issueDate,
          certificateUrl: verificationUrl,
          qrCodeData: qrData,
        },
      })
      .commit();

    console.log(`✅ Certificate generated successfully!`);
    console.log(`   - UID: ${certificateUID}`);
    console.log(`   - Verification URL: ${verificationUrl}`);
    console.log(`   - QR Data Length: ${qrData.length} characters`);

    return NextResponse.json({
      success: true,
      certificateUID,
      verificationUrl,
      qrCodeData: qrData,
      message: "Certificate generated successfully!",
    });
  } catch (error) {
    console.error("❌ Error generating certificate:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate", details: String(error) },
      { status: 500 }
    );
  }
}
