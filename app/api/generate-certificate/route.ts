import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { connectToDatabase } from "@/lib/mongodb";
import { Certification } from "@/lib/models";
import {
  buildCertificateParticipationParagraph,
  getCertificatePronouns,
  normalizeCertificateGender,
  type CertificateGender,
} from "@/lib/certificate/pronouns";
import { resolveImageUrl } from "@/lib/content-image";

async function generateCertificateUID(): Promise<string> {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const count = await Certification.countDocuments({
    "certificateDetails.certificateUID": { $exists: true, $ne: null },
  });
  const seq = (count + 1).toString().padStart(2, "0");
  return `NT-${date}-${seq}`;
}

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

async function generateCertificateHTML(data: {
  recipientName: string;
  courseName: string;
  courseHours: string;
  courseDays: string;
  gender?: CertificateGender;
  certificateUID: string;
  organizationName: string;
  issueDate: string;
  profileImageUrl?: string;
  qrCodeDataUrl?: string;
  signatoryName: string;
  signatoryTitle: string;
  logoUrl?: string;
  signatoryImageUrl?: string;
  partnerLogo1Url?: string;
  partnerLogo2Url?: string;
}): Promise<string> {
  const stripe = `
    <div style="line-height:0;">
      <div style="height:24px;background:#1D3461;"></div>
      <div style="height:13px;background:#ffffff;"></div>
      <div style="height:24px;background:#C8102E;"></div>
    </div>`;

  const logo = data.logoUrl || 'https://nepatronix.org/logo.png';
  const pronouns = getCertificatePronouns(data.gender);
  const participationParagraph = buildCertificateParticipationParagraph(pronouns);
  const participationHtml = participationParagraph
    .replace('electronics and innovation', '<strong>electronics and innovation</strong>')
    .replace('impact in society', '<strong>impact in society</strong>');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Great+Vibes&display=swap" rel="stylesheet">
  <style>
    *{margin:0;padding:0;box-sizing:border-box;line-height:normal;}
    body{margin:0;padding:0;}
  </style>
</head>
<body>
<div style="width:2000px;height:1414px;background:#fff;display:flex;flex-direction:column;overflow:hidden;font-family:Georgia,'Times New Roman',serif;">

  <div style="position:relative;display:flex;justify-content:center;align-items:center;height:100px;padding:0 72px;flex-shrink:0;">
    <div style="position:absolute;right:64px;top:28px;font-size:25px;font-weight:bold;color:#111;letter-spacing:0.3px;font-family:Georgia,serif;">
      Certificate code : ${data.certificateUID}
    </div>
  </div>

  <div style="display:flex;align-items:center;flex-shrink:0;">
    <div style="flex:1;line-height:0;"><div style="height:24px;background:#1D3461;"></div><div style="height:13px;background:#ffffff;"></div><div style="height:24px;background:#C8102E;"></div></div>
    <div style="padding:0 48px;flex-shrink:0;margin-top:-60px;"><img src="${logo}" alt="Nepatronix" style="height:220px;object-fit:contain;display:block;" /></div>
    <div style="flex:1;line-height:0;"><div style="height:24px;background:#1D3461;"></div><div style="height:13px;background:#ffffff;"></div><div style="height:24px;background:#C8102E;"></div></div>
  </div>

  <div style="text-align:center;padding-top:32px;padding-bottom:8px;font-family:'UnifrakturMaguntia',cursive;font-size:114px;color:#111;line-height:1;flex-shrink:0;">
    Certificate of participation
  </div>

  <div style="text-align:center;font-family:'Great Vibes',cursive;font-size:110px;color:#111;line-height:1.1;padding-top:4px;padding-bottom:8px;flex-shrink:0;">
    ${data.recipientName}
  </div>

  <div style="flex:1;display:flex;flex-direction:column;justify-content:center;text-align:center;font-size:27px;line-height:1.75;color:#222;padding:7px 178px 0;font-family:Georgia,serif;gap:14px;">
    <p>This is to certify that <strong>${data.recipientName}</strong> successfully participated in the <strong>${data.courseHours ? data.courseHours + '-minute ' : ''}${data.courseName}</strong>.</p>
    <p style="font-size:26px;">${participationHtml}</p>
  </div>

  <div style="display:flex;justify-content:space-between;align-items:flex-end;padding:0 78px 22px;flex-shrink:0;min-height:232px;">
    <div style="width:232px;flex-shrink:0;">
      ${data.qrCodeDataUrl
        ? `<img src="${data.qrCodeDataUrl}" alt="Verify" style="width:228px;height:228px;display:block;" />`
        : '<div style="width:228px;height:228px;"></div>'}
    </div>

      <div style="text-align:center;flex-shrink:0;position:relative;">
        <div style="height:160px;"></div>
        ${data.signatoryImageUrl
          ? `<img src="${data.signatoryImageUrl}" alt="Signature" style="position:absolute;bottom:108px;left:50%;transform:translateX(-50%);height:180px;max-width:900px;object-fit:contain;mix-blend-mode:multiply;" />`
          : ''}
      <div style="border-top:3px solid #222;padding-top:11px;min-width:392px;">
        <p style="font-size:27px;font-weight:bold;color:#111;margin-bottom:4px;">${data.signatoryName}</p>
        <p style="font-size:23px;color:#333;margin-bottom:4px;">${data.signatoryTitle}</p>
        <p style="font-size:21px;color:#555;">${data.organizationName}</p>
      </div>
    </div>

    <div style="display:flex;align-items:center;gap:43px;width:500px;justify-content:flex-end;flex-shrink:0;">
      ${data.partnerLogo1Url ? `<img src="${data.partnerLogo1Url}" alt="Partner" style="height:160px;max-width:232px;object-fit:contain;display:block;" />` : ''}
      ${data.partnerLogo2Url ? `<img src="${data.partnerLogo2Url}" alt="Partner" style="height:190px;max-width:230px;object-fit:contain;display:block;" />` : ''}
    </div>
    </div>
  </div>

  ${stripe}
</div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { applicationId } = await req.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }

    await connectToDatabase();
    const application = await Certification.findById(applicationId).lean<{
      applicantName?: string;
      gender?: string;
      email?: string;
      phone?: string;
      status?: string;
      courseName?: string;
      trainingHours?: string;
      trainingDays?: string;
      profileImage?: { url?: string };
      certificateDetails?: { certificateUID?: string };
    }>();

    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    if (application.status !== "approved") {
      return NextResponse.json(
        { error: "Application must be approved before generating certificate" },
        { status: 400 }
      );
    }

    const existingUID = application.certificateDetails?.certificateUID;
    const certificateUID = existingUID || (await generateCertificateUID());
    const issueDate = new Date().toISOString().split("T")[0];
    const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'https://nepatronix.org'}/verify-certificate/${certificateUID}`;
    const COMPANY_NAME = "Nepatronix Engineering Solution Pvt. Ltd.";

    const qrPayload = [
      `Certificate UID : ${certificateUID}`,
      `Full Name       : ${application.applicantName}`,
      `Issue Date      : ${new Date(issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      `Company         : ${COMPANY_NAME}`,
      `Verify at       : ${verificationUrl}`,
    ].join('\n');
    const qrCodeDataUrl = await generateQRCode(qrPayload);

    await generateCertificateHTML({
      recipientName: application.applicantName || "",
      courseName: application.courseName || "",
      courseHours: application.trainingHours || "",
      courseDays: application.trainingDays || "",
      gender: normalizeCertificateGender(application.gender),
      certificateUID,
      organizationName: COMPANY_NAME,
      issueDate,
      profileImageUrl: resolveImageUrl(application.profileImage),
      qrCodeDataUrl,
      signatoryName: process.env.SIGNATORY_NAME || "Director Name",
      signatoryTitle: process.env.SIGNATORY_TITLE || "Director, Nepatronix",
      signatoryImageUrl: process.env.SIGNATORY_IMAGE_URL,
      logoUrl: process.env.LOGO_URL,
      partnerLogo1Url: process.env.PARTNER_LOGO_1_URL,
      partnerLogo2Url: process.env.PARTNER_LOGO_2_URL,
    });

    await Certification.findByIdAndUpdate(applicationId, {
      status: "certificate_generated",
      certificateDetails: {
        certificateUID,
        issueDate: new Date(issueDate),
        certificateUrl: verificationUrl,
        qrCodeData: qrPayload,
      },
    });

    return NextResponse.json({
      success: true,
      certificateUID,
      verificationUrl,
      qrCodeData: qrPayload,
      qrCodeDataUrl,
      message: "Certificate generated successfully!",
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate", details: String(error) },
      { status: 500 }
    );
  }
}
