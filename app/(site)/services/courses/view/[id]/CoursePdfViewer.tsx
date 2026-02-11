"use client";

import { useEffect } from "react";
import Link from "next/link";

interface CoursePdfViewerProps {
  pdfUrl: string;
  courseName: string;
}

export default function CoursePdfViewer({ pdfUrl, courseName }: CoursePdfViewerProps) {
  // Prevent right-click and keyboard shortcuts
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".pdf-container")) {
        e.preventDefault();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent Ctrl+S, Ctrl+P, Ctrl+C
      if (e.ctrlKey && (e.key === "s" || e.key === "p" || e.key === "c")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* PDF Viewer */}
      <div 
        className="pdf-container bg-white rounded-2xl overflow-hidden shadow-lg relative"
        onContextMenu={(e) => e.preventDefault()}
        style={{ userSelect: "none" }}
      >
        {/* Header bar */}
        <div className="bg-slate-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#C1121F] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{courseName}</p>
              <p className="text-slate-400 text-xs">Course Overview Document</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400 text-xs bg-slate-700 px-2 py-1 rounded">
              View Only
            </span>
          </div>
        </div>

        {/* PDF iframe - using Google Docs viewer for better compatibility */}
        <div className="relative">
          <iframe
            src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
            className="w-full"
            style={{ 
              height: "75vh", 
              minHeight: "600px",
              border: 0,
            }}
            title="Course Overview PDF"
            allowFullScreen
          />
          {/* Invisible overlay to prevent interactions */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{ 
              background: "transparent",
              userSelect: "none",
              WebkitUserSelect: "none",
            }}
          />
        </div>
      </div>

      {/* Info Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div>
          <p className="text-amber-800 text-sm font-medium">Protected Educational Content</p>
          <p className="text-amber-700 text-sm mt-1">
            This document is for viewing purposes only. Downloading, copying, or unauthorized distribution is prohibited.
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-900 mb-4">Interested in this course?</h3>
        <div className="flex flex-wrap gap-3">
          <Link 
            href="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C1121F] text-white font-semibold text-sm rounded-lg hover:bg-[#A30F19] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Enquire Now
          </Link>
          <Link 
            href="/services/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Courses
          </Link>
        </div>
      </div>
    </div>
  );
}
