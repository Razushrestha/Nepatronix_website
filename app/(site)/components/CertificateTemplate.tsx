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
        image: { type: 'png' as const, quality: 0.99 },
        html2canvas: { 
          scale: 2.5, 
          useCORS: true, 
          allowTaint: true,
          backgroundColor: '#ffffff',
          letterRendering: true,
          windowHeight: 1500,
          windowWidth: 2100,
        },
        jsPDF: { orientation: 'landscape' as const, unit: 'px' as const, format: [2000, 1414] as [number, number] }
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

      {/* Certificate - Only this gets captured */}
      <div
        ref={certRef}
        style={{
          width: '2000px',
          height: '1414px',
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

      {/* ── Header: cert code top-right only ── */}
      <div style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100px',
        padding: '0 72px',
        flexShrink: 0,
      }}>
        {/* Cert code — top right */}
        <div style={{
          position: 'absolute',
          right: '64px',
          top: '28px',
          fontSize: '25px',
          fontWeight: 'bold',
          fontFamily: 'Georgia, serif',
          color: '#111',
          letterSpacing: '0.3px',
        }}>
          Certificate code : {certificateUID}
        </div>
      </div>

      {/* ── Divider: stripes flanking logo ── */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {/* Left stripe */}
        <div style={{ flex: 1, lineHeight: 0 }}>
          <div style={{ height: '24px', background: '#1D3461' }} />
          <div style={{ height: '13px',  background: '#ffffff' }} />
          <div style={{ height: '24px', background: '#C8102E' }} />
        </div>
        {/* Logo centered between stripes */}
        <div style={{ padding: '0 48px', flexShrink: 0, marginTop: '-70px' }}>
          <img
            src={resolvedLogo}
            alt="Nepatronix"
            style={{ height: '350px', objectFit: 'contain', display: 'block' }}
          />
        </div>
        {/* Right stripe */}
        <div style={{ flex: 1, lineHeight: 0 }}>
          <div style={{ height: '24px', background: '#1D3461' }} />
          <div style={{ height: '13px',  background: '#ffffff' }} />
          <div style={{ height: '24px', background: '#C8102E' }} />
        </div>
      </div>

      {/* ── Gothic title ── */}
      <div style={{
        textAlign: 'center',
        paddingTop: '8px',
        paddingBottom: '4px',
        fontFamily: '"UnifrakturMaguntia", cursive',
        fontSize: '114px',
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
        fontSize: '110px',
        color: '#111',
        lineHeight: '0.95',
        paddingTop: '0px',
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
        fontSize: '27px',
        lineHeight: '1.85',
        color: '#222',
        padding: '0 220px',
        fontFamily: 'Georgia, serif',
        gap: '32px',
      }}>
        <p style={{ fontSize: '28px' }}>
          This is to certify that{' '}
          <strong>{recipientName}</strong>{' '}
          successfully participated in the{' '}
          <strong>{courseHours ? `${courseHours} hours ` : ''}{courseName}</strong>.
        </p>
        <p style={{ fontSize: '28px' }}>
          During the workshop, {pronouns.subject} demonstrated enthusiasm for learning and a keen interest in{' '}
          <strong>electronics and innovation</strong>. We appreciate {pronouns.possessive} active participation and
          encourage {pronouns.object} to continue exploring technology and innovation to create meaningful{' '}
          <strong>impact in society</strong> and contribute to the nation&apos;s development.
        </p>
      </div>

      {/* ── Bottom row: QR | Signature | Partner logos ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        padding: '0 78px 22px',
        flexShrink: 0,
        minHeight: '232px',
      }}>

        {/* Left: QR code — no border, no label */}
        <div style={{ width: '232px', flexShrink: 0 }}>
          {qrCodeDataUrl && (
            <img
              src={qrCodeDataUrl}
              alt="Verify"
              style={{ width: '228px', height: '228px', display: 'block' }}
            />
          )}
        </div>

        {/* Centre: signature image + line + name/title/org */}
        <div style={{ textAlign: 'center', flexShrink: 0, position: 'relative' }}>
          {/* Invisible spacer for layout */}
          <div style={{ height: '35px' }} />
          {/* Signature image aligned with the line */}
          <img
            src={resolvedSignature}
            alt="Signature"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            style={{
              marginBottom: '-100px', // Slight overlap with the line
              height: '380px', // Even larger
              maxWidth: '1500px', // Even wider
              objectFit: 'contain',
              mixBlendMode: 'multiply',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          />
          <div style={{
            borderTop: '3px solid #222',
            paddingTop: '11px',
            minWidth: '392px',
          }}>
            <p style={{ fontSize: '27px', fontWeight: 'bold', color: '#111', marginBottom: '4px' }}>
              {signatoryName}
            </p>
            <p style={{ fontSize: '23px', color: '#333', marginBottom: '4px' }}>
              {signatoryTitle}
            </p>
            <p style={{ fontSize: '21px', color: '#555' }}>{organizationName}</p>
          </div>
        </div>

        {/* Right: two partner logos side-by-side */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '43px',
          width: '500px',
          justifyContent: 'flex-end',
          flexShrink: 0,
        }}>
          {partnerLogo1Url && (
            <img
              src={partnerLogo1Url}
              alt="Partner 1"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              style={{ height: '160px', maxWidth: '232px', objectFit: 'contain', display: 'block' }}
            />
          )}
          {partnerLogo2Url && (
            <img
              src={partnerLogo2Url}
              alt="Partner 2"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              style={{ height: '300px', maxWidth: '400px', objectFit: 'contain', display: 'block' }}
            />
          )}
        </div>
      </div>

      {/* ── Bottom stripes ── */}
      <StripeBar />
      </div>
    </div>
  );
}
