# Certificate Application System - Documentation

## Overview

This system allows users to apply for course certificates, administrators to approve applications, and automatically generates professional certificates with QR code verification.

## System Architecture

### Components

1. **Application Form** (`/services/apply-certificate`)
   - User-facing form for certificate applications
   - Collects: Name, Email, Phone, Course Type, Hours, Days, Profile Image, Payment Screenshot
   - Uploads images to Sanity, then submits to API

2. **Sanity Schemas**
   - `courseApplication` - Stores all application data with status tracking
   - `certificate` - Stores generated certificate details

3. **API Routes**
   - `/api/apply-certificate` - Handles application submissions
   - `/api/generate-certificate` - Generates certificates (auto-triggered on approval)
   - `/api/update-application-status` - Admin workflow for status updates

4. **Certificate Template** (`app/(site)/components/CertificateTemplate.tsx`)
   - React component defining certificate layout
   - Layout: Top (Logo), Left (Profile Image), Center (Text), Right (QR Code+UID), Bottom (Signature)

5. **Verification Page** (`/verify-certificate/[uid]`)
   - Public page to verify certificate authenticity
   - Shows certificate details and recipient information

## Workflow

### 1. User Application Submission

```
User fills form → Uploads images to Sanity → Submits to /api/apply-certificate
→ Creates courseApplication document (status: "pending")
→ Sends confirmation email to user
```

### 2. Admin Review (Sanity Studio)

**Access Sanity Studio**: `http://localhost:3000/studio` (or your production domain)

**Admin Actions:**

1. **View Applications**
   - Go to "Course Applications" in Sanity Studio
   - See all applications with status indicators:
     - ⏳ Pending Payment
     - ✅ Payment Verified
     - 🎓 Approved
     - 📜 Certificate Generated
     - ❌ Rejected

2. **Approve Application**
   - Open an application
   - Change status to "approved"
   - Add admin notes if needed
   - Click "Publish"
   - **Certificate auto-generates immediately**
   - User receives approval email

3. **Reject Application**
   - Change status to "rejected"
   - Add reason in "Admin Notes"
   - User receives rejection email with reason

### 3. Certificate Generation (Automatic)

```
Admin approves → /api/update-application-status
→ Triggers /api/generate-certificate
→ Creates certificate UID (e.g., NTX-2026-12345)
→ Generates QR code with verification data
→ Creates certificate document in Sanity
→ Updates application status to "certificate_generated"
→ Sends certificate ready email
```

### 4. Certificate Verification

Users can verify certificates at:
```
https://nepatronix.org/verify-certificate/[UID]
```

QR code on certificate contains:
- Certificate UID
- Recipient name
- Course name
- Verification URL

## Certificate Layout

```
┌─────────────────────────────────────────┐
│           [Nepatronix Logo]             │
├─────────┬───────────────────┬──────────┤
│         │                   │          │
│ [Photo] │  Certificate Text │ [QR Code]│
│(Circle) │   - Title         │  + UID   │
│         │   - Name (bold)   │          │
│         │   - Hours/Days    │          │
│         │   - Course Name   │          │
│         │   - Description   │          │
│         │                   │          │
├─────────┴───────────────────┴──────────┤
│  Date: [Issue Date]    [Signature]     │
│                        [Name & Title]   │
└─────────────────────────────────────────┘
```

## Email Notifications

### Automatic emails sent on status changes:

1. **Pending** - "Application Received - Pending Payment Verification"
2. **Payment Verified** - "Payment Verified - Application Approved"
3. **Approved** - "Application Approved - Certificate Generation"
4. **Certificate Generated** - "🎓 Certificate Ready - Download Now"
5. **Rejected** - "Application Status Update" (with reason)

## Admin Workflow Example

### Scenario: New Application Received

1. **Check Email/Sanity**: New application appears with ⏳ status
2. **Review Details**: Check name, course type, payment screenshot (if paid)
3. **Verify Payment**: Confirm transaction ID and amount
4. **Change Status**: 
   - If payment ok → "payment_verified" → User gets email
   - Then → "approved" → Certificate auto-generates → User gets download link
   - If payment issue → "rejected" → Add notes → User gets rejection reason

### Status Flow

```
pending
  ↓
payment_verified (optional, for tracking)
  ↓
approved (triggers certificate generation)
  ↓
certificate_generated (final status)
```

OR

```
pending
  ↓
rejected (with reason in adminNotes)
```

## Environment Variables

Add to `.env.local`:

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production

# Email Service
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key

# Certificate Settings
NEXT_PUBLIC_BASE_URL=https://nepatronix.org
SIGNATORY_NAME=Director Name
SIGNATORY_TITLE=Director, Nepatronix
```

## Testing Locally

1. Start dev server: `npm run dev`
2. Open: `http://localhost:3000/services/apply-certificate`
3. Fill form and submit
4. Open Sanity Studio: `http://localhost:3000/studio`
5. Go to "Course Applications"
6. Approve the application
7. Check "Certificates" section for generated certificate
8. Verify at: `http://localhost:3000/verify-certificate/[UID]`

## Future Enhancements

### PDF Generation (Optional)
Currently generates HTML certificates. To add PDF generation:

```bash
npm install puppeteer
```

Then update `/api/generate-certificate/route.ts` to use Puppeteer for HTML→PDF conversion.

### Canva Integration (Optional)
If you want to use Canva templates:

1. Get Canva API access: https://www.canva.dev/
2. Create template in Canva
3. Map fields in API route
4. Use Canva autofill API

## Troubleshooting

### Application Submission Fails
- Check Sanity credentials in `.env.local`
- Verify image upload permissions in Sanity dashboard
- Check browser console for errors

### Certificate Not Generating
- Ensure status is set to "approved"
- Check API route logs in terminal
- Verify QRCode package is installed

### Verification Page 404
- Ensure certificate UID is correct
- Check if certificate document exists in Sanity
- Verify route file is in correct location

## Support

For issues or questions:
1. Check Sanity Studio logs
2. Check browser console
3. Check terminal/server logs
4. Review application status in Sanity

---

**System Status**: ✅ Fully Functional
**Last Updated**: February 2026
