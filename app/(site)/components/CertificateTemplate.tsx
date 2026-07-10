'use client';
import React from 'react';
import {
  getCertificatePronouns,
  normalizeCertificateGender,
  type CertificateGender,
} from '@/lib/certificate/pronouns';

interface CertificateTemplateProps {
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
  // Uploadable assets
  logoUrl?: string;           // company logo — default /logo.png
  signatoryImageUrl?: string; // CEO signature image
  partnerLogo1Url?: string;   // e.g. IITM PRAVARTAK
  partnerLogo2Url?: string;   // e.g. innovator
}

function StripeBar() {
  return (
    <div style={{ lineHeight: 0 }}>
      <div style={{ height: '24px', background: '#1D3461' }} />
      <div style={{ height: '13px',  background: '#ffffff' }} />
      <div style={{ height: '24px', background: '#C8102E' }} />
    </div>
  );
}

export function CertificateTemplate({
  recipientName,
  courseName,
  courseHours,
  gender,
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
  const resolvedSignature = signatoryImageUrl || '/signaturee.png';
  const pronouns = getCertificatePronouns(gender);

  // Ref for certificate div
  const certRef = React.useRef<HTMLDivElement>(null);

  // Download handler with improved html2canvas settings
  const handleDownloadPDF = async () => {
    if (!certRef.current) return;
    
    try {
      // Dynamically import html2pdf
      const html2pdf = (await import('html2pdf.js')).default;
      
      // Wait for fonts to fully load
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const element = certRef.current;
      const options = {
        margin: 0,
        filename: `certificate-${certificateUID}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff',
          letterRendering: true,
          windowHeight: 1500,
          windowWidth: 2100,
        },
        // True A4 landscape paper size.
        jsPDF: { orientation: 'landscape' as const, unit: 'mm' as const, format: 'a4' as const },
      };
      
      html2pdf().set(options).from(element).save();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF certificate. Please try again.');
    }
  };

  const handleDownloadPNG = async () => {
    if (!certRef.current) return;
    
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      
      // Wait for fonts to load
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        allowTaint: true,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        windowHeight: 1500,
        windowWidth: 2100,
      });
      
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = `certificate-${certificateUID}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading PNG:', error);
      alert('Failed to download PNG certificate. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'flex-start' }}>
      {/* Download Buttons - Outside certificate div */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleDownloadPDF}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#1D3461',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => { (e.target as HTMLButtonElement).style.background = '#0f1f3a'; }}
          onMouseOut={(e) => { (e.target as HTMLButtonElement).style.background = '#1D3461'; }}
        >
          📄 Download PDF
        </button>
        <button
          onClick={handleDownloadPNG}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            background: '#C8102E',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            transition: 'background 0.2s',
          }}
          onMouseOver={(e) => { (e.target as HTMLButtonElement).style.background = '#a00820'; }}
          onMouseOut={(e) => { (e.target as HTMLButtonElement).style.background = '#C8102E'; }}
        >
          🖼️ Download Image
        </button>
      </div>

      {/* Certificate - Only this gets captured. Fixed A4 landscape (√2 ratio). */}
      <div
        ref={certRef}
        style={{
          width: '2000px',
          height: '1414px',
          fontFamily: 'Georgia, "Times New Roman", serif',
          background: '#ffffff',
          position: 'relative',
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

        {/* Full-bleed top & bottom accent stripes */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}><StripeBar /></div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}><StripeBar /></div>

        {/* Decorative double frame */}
        <div style={{ position: 'absolute', top: '88px', left: '70px', right: '70px', bottom: '88px', border: '3px solid #1D3461' }} />
        <div style={{ position: 'absolute', top: '99px', left: '81px', right: '81px', bottom: '99px', border: '1px solid #C8102E' }} />

        {/* Certificate code — top right inside frame */}
        <div style={{
          position: 'absolute', right: '110px', top: '120px',
          fontSize: '24px', fontWeight: 'bold', color: '#333', letterSpacing: '0.3px',
        }}>
          Certificate code : {certificateUID}
        </div>

        {/* Content column */}
        <div style={{
          position: 'absolute', top: '88px', left: '70px', right: '70px', bottom: '88px',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '70px 150px 60px', boxSizing: 'border-box', textAlign: 'center',
        }}>
          {/* Logo */}
          <img src={resolvedLogo} alt="Nepatronix" style={{ height: '150px', objectFit: 'contain', display: 'block' }} />

          {/* Title */}
          <div style={{ fontFamily: '"UnifrakturMaguntia", cursive', fontSize: '92px', color: '#111', lineHeight: 1.1, marginTop: '18px' }}>
            Certificate of Participation
          </div>

          {/* Presented-to line */}
          <div style={{ fontSize: '24px', color: '#555', letterSpacing: '4px', textTransform: 'uppercase', marginTop: '18px' }}>
            This certificate is proudly presented to
          </div>

          {/* Recipient name */}
          <div style={{ fontFamily: '"Great Vibes", cursive', fontSize: '104px', color: '#1D3461', lineHeight: 1.1, marginTop: '6px' }}>
            {recipientName}
          </div>
          {/* Accent underline */}
          <div style={{ width: '520px', height: '3px', background: '#C8102E', marginTop: '4px', opacity: 0.7 }} />

          {/* Body paragraphs */}
          <div style={{ maxWidth: '1500px', marginTop: '34px', fontSize: '27px', lineHeight: 1.8, color: '#333' }}>
            <p style={{ marginBottom: '20px' }}>
              This is to certify that{' '}
              <strong>{recipientName}</strong>{' '}
              has successfully participated in the{' '}
              <strong>{courseHours ? `${courseHours} hours ` : ''}{courseName}</strong>.
            </p>
            <p>
              During the workshop, {pronouns.subject} demonstrated enthusiasm for learning and a keen interest in{' '}
              <strong>electronics and innovation</strong>. We appreciate {pronouns.possessive} active participation and
              encourage {pronouns.object} to continue exploring technology to create meaningful{' '}
              <strong>impact in society</strong>.
            </p>
          </div>

          {/* Bottom row pinned to bottom of the content area */}
          <div style={{
            marginTop: 'auto', width: '100%',
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
          }}>
            {/* QR */}
            <div style={{ width: '200px', flexShrink: 0, textAlign: 'center' }}>
              {qrCodeDataUrl && (
                <img src={qrCodeDataUrl} alt="Verify" style={{ width: '190px', height: '190px', display: 'block', margin: '0 auto' }} />
              )}
              <div style={{ fontSize: '16px', color: '#666', marginTop: '8px' }}>Scan to verify</div>
            </div>

            {/* Signature */}
            <div style={{ textAlign: 'center', flexShrink: 0, position: 'relative', paddingBottom: '4px' }}>
              <img
                src={resolvedSignature}
                alt="Signature"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                style={{ height: '150px', maxWidth: '460px', objectFit: 'contain', mixBlendMode: 'multiply', display: 'block', margin: '0 auto -18px' }}
              />
              <div style={{ borderTop: '3px solid #222', paddingTop: '10px', minWidth: '420px' }}>
                <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#111', marginBottom: '4px' }}>{signatoryName}</p>
                <p style={{ fontSize: '22px', color: '#333', marginBottom: '2px' }}>{signatoryTitle}</p>
                <p style={{ fontSize: '20px', color: '#555' }}>{organizationName}</p>
              </div>
            </div>

            {/* Partner logos */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '40px', width: '340px', justifyContent: 'flex-end', flexShrink: 0 }}>
              {partnerLogo1Url && (
                <img src={partnerLogo1Url} alt="Partner 1" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  style={{ height: '130px', maxWidth: '200px', objectFit: 'contain', display: 'block' }} />
              )}
              {partnerLogo2Url && (
                <img src={partnerLogo2Url} alt="Partner 2" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  style={{ height: '150px', maxWidth: '200px', objectFit: 'contain', display: 'block' }} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
