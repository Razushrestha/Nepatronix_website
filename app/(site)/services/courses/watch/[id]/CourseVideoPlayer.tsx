"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface CourseVideo {
  _id: string;
  title: string;
  description?: string;
  videoUrl?: string;
  videoFile?: {
    asset?: {
      url: string;
    };
    url?: string;
  };
  thumbnail?: {
    asset?: {
      url: string;
    };
    url?: string;
  };
  overviewPdf?: {
    asset?: {
      url: string;
    };
    url?: string;
  };
  duration?: string;
  order: number;
}

interface CourseVideoPlayerProps {
  videos: CourseVideo[];
  courseName: string;
}

export default function CourseVideoPlayer({ videos, courseName }: CourseVideoPlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<CourseVideo>(videos[0]);
  const [activeTab, setActiveTab] = useState<"video" | "overview">("video");
  const videoRef = useRef<HTMLVideoElement>(null);

  // Get video source - prefer file over URL
  const getVideoSource = (video: CourseVideo) => {
    if (video.videoFile?.asset?.url) {
      return video.videoFile.asset.url;
    }
    return video.videoUrl || "";
  };

  // Check if video is external (YouTube, Vimeo, etc.)
  const isExternalVideo = (url: string) => {
    return url.includes("youtube") || url.includes("vimeo") || url.includes("youtu.be");
  };

  // Prevent right-click on video
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "VIDEO" || target.closest(".video-container")) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);
    return () => document.removeEventListener("contextmenu", handleContextMenu);
  }, []);

  const videoSource = getVideoSource(selectedVideo);
  const pdfUrl = selectedVideo.overviewPdf?.asset?.url;

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Video/PDF Player Area */}
      <div className="lg:col-span-2">
        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setActiveTab("video")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === "video"
                ? "bg-[#C1121F] text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Watch Video
          </button>
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 ${
              activeTab === "overview"
                ? "bg-[#C1121F] text-white"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Course Overview
          </button>
        </div>

        {activeTab === "video" ? (
          <>
            {/* Video Player */}
            <div 
              className="video-container bg-black rounded-2xl overflow-hidden shadow-2xl relative"
              onContextMenu={(e) => e.preventDefault()}
            >
              {videoSource ? (
                isExternalVideo(videoSource) ? (
                  // Embed external video
                  <div className="aspect-video">
                    <iframe
                      src={videoSource}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{ border: 0 }}
                    />
                  </div>
                ) : (
                  // Native video player with protection
                  <div className="relative">
                    <video
                      ref={videoRef}
                      key={selectedVideo._id}
                      className="w-full aspect-video"
                      controls
                      controlsList="nodownload noplaybackrate"
                      disablePictureInPicture
                      onContextMenu={(e) => e.preventDefault()}
                      poster={selectedVideo.thumbnail?.asset?.url}
                    >
                      <source src={videoSource} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    {/* Overlay to prevent easy screen capture */}
                    <div 
                      className="absolute inset-0 pointer-events-none"
                      style={{ 
                        background: "transparent",
                        userSelect: "none",
                        WebkitUserSelect: "none",
                      }}
                    />
                  </div>
                )
              ) : (
                // No video available
                <div className="aspect-video flex items-center justify-center bg-slate-900">
                  <div className="text-center text-slate-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>Video coming soon</p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* PDF Viewer */}
            <div 
              className="pdf-container bg-white rounded-2xl overflow-hidden shadow-2xl relative"
              onContextMenu={(e) => e.preventDefault()}
              style={{ userSelect: "none" }}
            >
              {pdfUrl ? (
                <div className="relative">
                  {/* PDF iframe with toolbar hidden */}
                  <iframe
                    src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                    className="w-full"
                    style={{ 
                      height: "70vh", 
                      minHeight: "500px",
                      border: 0,
                    }}
                    title="Course Overview PDF"
                  />
                  {/* Invisible overlay to prevent right-click and selection */}
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                      background: "transparent",
                      userSelect: "none",
                      WebkitUserSelect: "none",
                    }}
                  />
                </div>
              ) : (
                // No PDF available
                <div className="flex items-center justify-center bg-slate-50 py-20">
                  <div className="text-center text-slate-400">
                    <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="font-medium text-slate-600">Course Overview Not Available</p>
                    <p className="text-sm mt-1">PDF will be uploaded soon</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Video/PDF Info */}
        <div className="mt-6 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedVideo.title}</h2>
          {selectedVideo.duration && activeTab === "video" && (
            <span className="inline-flex items-center gap-1 text-sm text-slate-500 mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {selectedVideo.duration}
            </span>
          )}
          {activeTab === "overview" && pdfUrl && (
            <span className="inline-flex items-center gap-1 text-sm text-green-600 mb-4">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Course syllabus and overview available
            </span>
          )}
          {selectedVideo.description && (
            <p className="text-slate-600 leading-relaxed">{selectedVideo.description}</p>
          )}
        </div>

        {/* Notice */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-amber-800 text-sm font-medium">Educational Content</p>
            <p className="text-amber-700 text-sm mt-1">
              This content is protected and for enrolled students only. Unauthorized distribution is prohibited.
            </p>
          </div>
        </div>
      </div>

      {/* Video List */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-900">Course Videos</h3>
            <p className="text-sm text-slate-500">{courseName}</p>
          </div>
          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {videos.map((video, index) => (
              <button
                key={video._id}
                onClick={() => setSelectedVideo(video)}
                className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex gap-3 ${
                  selectedVideo._id === video._id ? "bg-[#C1121F]/5 border-l-4 border-[#C1121F]" : ""
                }`}
              >
                <div className="flex-shrink-0 w-24 h-14 bg-slate-200 rounded-lg overflow-hidden relative">
                  {video.thumbnail?.asset?.url ? (
                    <Image
                      src={video.thumbnail.asset.url}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-800">
                      <svg className="w-8 h-8 text-white/50" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                  {selectedVideo._id === video._id && (
                    <div className="absolute inset-0 bg-[#C1121F]/80 flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm truncate ${
                    selectedVideo._id === video._id ? "text-[#C1121F]" : "text-slate-900"
                  }`}>
                    {index + 1}. {video.title}
                  </p>
                  {video.duration && (
                    <p className="text-xs text-slate-500 mt-1">{video.duration}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
