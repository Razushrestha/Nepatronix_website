interface CertificateTemplateProps {
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
  // Uploadable assets
  logoUrl?: string;           // company logo — default /logo.png
  signatoryImageUrl?: string; // CEO signature image
  partnerLogo1Url?: string;   // e.g. IITM PRAVARTAK
  partnerLogo2Url?: string;   // e.g. innovator
}

function StripeBar() {
  return (
    <div style={{ lineHeight: 0 }}>
      <div style={{ height: '6px', background: '#1A2873' }} />
      <div style={{ height: '13px', background: '#C1121F' }} />
    </div>
  );
}

export function CertificateTemplate({
  recipientName,
  courseName,
  courseHours,
  certificateUID,
  organizationName,
  issueDate,
  qrCodeDataUrl,
  signatoryName,
  signatoryTitle,
  logoUrl,
  signatoryImageUrl,
  partnerLogo1Url,
  partnerLogo2Url,
}: CertificateTemplateProps) {
  const resolvedLogo = logoUrl || '/logo.png';

  return (
    <div
      style={{
        width: '1123px',
        height: '794px',
        fontFamily: 'Georgia, "Times New Roman", serif',
        background: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        boxSizing: 'border-box',
        lineHeight: 'normal',
      }}
    >
      {/* Google Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&family=Great+Vibes&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}} />

      {/* ── Top stripes ── */}
      <StripeBar />

      {/* ── Header: logo centred, cert code bold top-right ── */}
      <div style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '108px',
        padding: '0 40px',
        flexShrink: 0,
      }}>
        {/* Cert code — top right */}
        <div style={{
          position: 'absolute',
          right: '36px',
          top: '16px',
          fontSize: '14px',
          fontWeight: 'bold',
          fontFamily: 'Georgia, serif',
          color: '#111',
          letterSpacing: '0.3px',
        }}>
          Certificate code : {certificateUID}
        </div>
        {/* Logo centred */}
        <img
          src={resolvedLogo}
          alt="Nepatronix"
          style={{ height: '80px', objectFit: 'contain', display: 'block' }}
        />
      </div>

      {/* ── Divider stripes ── */}
      <StripeBar />

      {/* ── Gothic title ── */}
      <div style={{
        textAlign: 'center',
        paddingTop: '18px',
        paddingBottom: '4px',
        fontFamily: '"UnifrakturMaguntia", cursive',
        fontSize: '64px',
        color: '#111',
        lineHeight: '1',
        flexShrink: 0,
      }}>
        Certificate of participation
      </div>

      {/* ── Cursive recipient name ── */}
      <div style={{
        textAlign: 'center',
        fontFamily: '"Great Vibes", cursive',
        fontSize: '62px',
        color: '#111',
        lineHeight: '1.1',
        paddingTop: '2px',
        paddingBottom: '4px',
        flexShrink: 0,
      }}>
        {recipientName}
      </div>

      {/* ── Body text ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '15.5px',
        lineHeight: '1.75',
        color: '#222',
        padding: '4px 100px 0',
        fontFamily: 'Georgia, serif',
        gap: '8px',
      }}>
        <p>
          This is to certify that{' '}
          <strong>{recipientName}</strong>{' '}
          successfully participated in the{' '}
          <strong>{courseHours ? `${courseHours}-minute ` : ''}{courseName}</strong>.
        </p>
        <p style={{ fontSize: '15px' }}>
          During the workshop, he demonstrated enthusiasm for learning and a keen interest in{' '}
          <strong>electronics and innovation</strong>. We appreciate his active participation and
          encourage him to continue exploring technology and innovation to create meaningful{' '}
          <strong>impact in society</strong> and contribute to the nation&apos;s development.
        </p>
      </div>

      {/* ── Bottom row: QR | Signature | Partner logos ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '0 44px 12px',
        flexShrink: 0,
        minHeight: '130px',
      }}>

        {/* Left: QR code — no border, no label */}
        <div style={{ width: '130px', flexShrink: 0 }}>
          {qrCodeDataUrl && (
            <img
              src={qrCodeDataUrl}
              alt="Verify"
              style={{ width: '128px', height: '128px', display: 'block' }}
            />
          )}
        </div>

        {/* Centre: signature image + line + name/title/org */}
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          {signatoryImageUrl ? (
            <img
              src={signatoryImageUrl}
              alt="Signature"
              style={{
                height: '64px',
                maxWidth: '200px',
                objectFit: 'contain',
                display: 'block',
                margin: '0 auto 6px',
              }}
            />
          ) : (
            <div style={{ height: '70px' }} />
          )}
          <div style={{
            borderTop: '1.5px solid #222',
            paddingTop: '6px',
            minWidth: '220px',
          }}>
            <p style={{ fontSize: '15px', fontWeight: 'bold', color: '#111', marginBottom: '2px' }}>
              {signatoryName}
            </p>
            <p style={{ fontSize: '13px', color: '#333', marginBottom: '2px' }}>
              {signatoryTitle}
            </p>
            <p style={{ fontSize: '12px', color: '#555' }}>{organizationName}</p>
          </div>
        </div>

        {/* Right: two partner logos side-by-side */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '16px',
          width: '220px',
          justifyContent: 'flex-end',
          flexShrink: 0,
        }}>
          {partnerLogo1Url && (
            <img
              src={partnerLogo1Url}
              alt="Partner 1"
              style={{ height: '70px', objectFit: 'contain', display: 'block' }}
            />
          )}
          {partnerLogo2Url && (
            <img
              src={partnerLogo2Url}
              alt="Partner 2"
              style={{ height: '70px', objectFit: 'contain', display: 'block' }}
            />
          )}
        </div>
      </div>

      {/* ── Bottom stripes ── */}
      <StripeBar />
    </div>
  );
}
