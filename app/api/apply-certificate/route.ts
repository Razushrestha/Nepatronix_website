import { NextRequest, NextResponse } from "next/server";
import { normalizeCertificateGender } from "@/lib/certificate/pronouns";
import { connectToDatabase } from "@/lib/mongodb";
import { Certification } from "@/lib/models";
import { uploadBuffer, fileUrl } from "@/lib/gridfs";

export const runtime = "nodejs";

async function generateCertificateUID(): Promise<string> {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const count = await Certification.countDocuments({ "certificateDetails.certificateUID": { $exists: true, $ne: null } });
  const seq = (count + 1).toString().padStart(2, "0");
  return `NT-${date}-${seq}`;
}

async function storeBase64Image(dataUrl: string, prefix: string): Promise<{ url: string } | null> {
  try {
    const base64Data = dataUrl.split(",")[1];
    if (!base64Data) return null;
    const buffer = Buffer.from(base64Data, "base64");
    const id = await uploadBuffer(buffer, `${prefix}-${Date.now()}.jpg`, "image/jpeg");
    return { url: fileUrl(id) };
  } catch (err) {
    console.error(`${prefix} image upload error:`, err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      fullName,
      gender,
      email,
      contactNumber,
      courseType,
      trainingHours,
      trainingDays,
      courseName,
      profileImage,
      paymentScreenshot,
    } = body;

    const normalizedGender = normalizeCertificateGender(gender);

    if (!fullName || !gender || !email || !contactNumber || !courseType || !trainingHours || !trainingDays) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectToDatabase();

    const profileImg = profileImage ? await storeBase64Image(profileImage, "profile") : null;
    const paymentImg = paymentScreenshot ? await storeBase64Image(paymentScreenshot, "payment") : null;

    const certificateUID = await generateCertificateUID();
    const now = new Date();
    const certificateUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://nepatronix.org"}/verify-certificate/${certificateUID}`;

    const application = await Certification.create({
      applicantName: fullName,
      gender: normalizedGender,
      email,
      phone: contactNumber,
      courseType,
      trainingHours,
      trainingDays,
      courseName: courseName || `${trainingHours} hours / ${trainingDays} days course`,
      status: "pending",
      submittedAt: now,
      profileImage: profileImg || undefined,
      paymentDetails: {
        amount: courseType === "free" ? 0 : undefined,
        paymentMethod: "Pending",
        paymentDate: now,
        paymentProof: paymentImg || undefined,
      },
      certificateDetails: {
        certificateUID,
        issueDate: now,
        certificateUrl,
        qrCodeData: certificateUrl,
      },
    });

    return NextResponse.json({
      success: true,
      applicationId: application._id.toString(),
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
