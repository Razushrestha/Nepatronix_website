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
}

export function CertificateTemplate({
  recipientName,
  courseName,
  courseHours,
  courseDays,
  certificateUID,
  organizationName,
  issueDate,
  profileImageUrl,
  qrCodeDataUrl,
  signatoryName,
  signatoryTitle,
}: CertificateTemplateProps) {
  return (
    <div
      style={{
        width: '1123px', // A4 landscape (297mm)
        height: '794px',  // A4 landscape (210mm)
        padding: '60px',
        fontFamily: 'Georgia, serif',
        position: 'relative',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: '12px solid #C1121F',
        boxSizing: 'border-box',
      }}
    >
      {/* Top: Nepatronix Logo */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img
          src="https://nepatronix.org/logo.png"
          alt="Nepatronix"
          style={{ height: '80px', objectFit: 'contain' }}
        />
      </div>

      {/* Main Content Container */}
      <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
        {/* Left: Circular Profile Image */}
        <div style={{ flex: '0 0 180px' }}>
          {profileImageUrl && (
            <img
              src={profileImageUrl}
              alt={recipientName}
              style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '6px solid #C1121F',
                boxShadow: '0 4px 12px rgba(193, 18, 31, 0.3)',
              }}
            />
          )}
        </div>

        {/* Center: Certificate Content */}
        <div style={{ flex: '1', paddingTop: '20px' }}>
          <h1
            style={{
              fontSize: '48px',
              color: '#C1121F',
              textAlign: 'center',
              marginBottom: '20px',
              fontWeight: 'bold',
              textTransform: 'uppercase',
              letterSpacing: '2px',
            }}
          >
            Certificate of Completion
          </h1>

          <div
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: '#333',
              textAlign: 'center',
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <p style={{ marginBottom: '20px' }}>
              This is to certify that{' '}
              <strong style={{ fontSize: '24px', color: '#C1121F' }}>
                {recipientName}
              </strong>{' '}
              has successfully completed the{' '}
              <strong>
                {courseHours} hours / {courseDays} days
              </strong>{' '}
              professional course titled
            </p>

            <p
              style={{
                fontSize: '22px',
                fontWeight: 'bold',
                color: '#C1121F',
                margin: '20px 0',
              }}
            >
              &ldquo;{courseName}&rdquo;
            </p>

            <p style={{ marginBottom: '30px' }}>
              conducted by <strong>{organizationName}</strong>.
            </p>

            <p style={{ fontSize: '14px', fontStyle: 'italic', color: '#666' }}>
              During the course, the participant demonstrated dedication,
              commitment, and a clear understanding of the concepts covered,
              meeting all the prescribed requirements of the program.
            </p>
          </div>
        </div>

        {/* Right: QR Code + UID */}
        <div style={{ flex: '0 0 180px', textAlign: 'center' }}>
          {qrCodeDataUrl && (
            <>
              <img
                src={qrCodeDataUrl}
                alt="Verification QR"
                style={{
                  width: '150px',
                  height: '150px',
                  border: '4px solid #C1121F',
                  padding: '8px',
                  background: 'white',
                }}
              />
              <p
                style={{
                  marginTop: '10px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#C1121F',
                  wordBreak: 'break-word',
                }}
              >
                {certificateUID}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Bottom: Signature */}
      <div
        style={{
          position: 'absolute',
          bottom: '60px',
          left: '60px',
          right: '60px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '5px' }}>
            Issue Date: {new Date(issueDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div style={{ textAlign: 'center', borderTop: '2px solid #333', paddingTop: '10px', minWidth: '200px' }}>
          <p style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' }}>
            {signatoryName}
          </p>
          <p style={{ fontSize: '12px', color: '#666' }}>
            {signatoryTitle}
          </p>
        </div>
      </div>
    </div>
  );
}
