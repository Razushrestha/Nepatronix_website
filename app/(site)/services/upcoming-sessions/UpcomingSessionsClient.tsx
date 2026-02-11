"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export interface UpcomingSession {
  _id: string;
  title: string;
  slug: string;
  hours: number;
  duration: string;
  deliveryMode: string;
  price: number;
  priceUnit: string;
  isFree: boolean;
  level: string;
  sessionStatus?: string; // 'upcoming', 'ongoing', or 'completed'
  sessionStartDate: string;
  sessionEndDate: string;
  enrollmentDeadline: string;
  maxSeats: number;
  currentEnrollments: number;
  sessionVenue: string;
  batchName: string;
  meetingUrl: string;
  pdfUrl: string;
}

interface Props {
  sessions: UpcomingSession[];
}

// Copy to clipboard helper
function CopyMeetingButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-blue-200 bg-blue-50 rounded-xl text-blue-700 font-medium hover:border-blue-400 hover:bg-blue-100 transition-all"
    >
      {copied ? (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy Meeting Link
        </>
      )}
    </button>
  );
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getTimeUntil(dateString: string): { days: number; hours: number; minutes: number; seconds: number } {
  const now = new Date().getTime();
  const target = new Date(dateString).getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState(getTimeUntil(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeUntil(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-2">
      <div className="bg-slate-800 text-white px-3 py-2 rounded-lg text-center min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.days}</span>
        <p className="text-[10px] text-slate-400 uppercase">Days</p>
      </div>
      <div className="bg-slate-800 text-white px-3 py-2 rounded-lg text-center min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.hours}</span>
        <p className="text-[10px] text-slate-400 uppercase">Hours</p>
      </div>
      <div className="bg-slate-800 text-white px-3 py-2 rounded-lg text-center min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.minutes}</span>
        <p className="text-[10px] text-slate-400 uppercase">Mins</p>
      </div>
      <div className="bg-slate-800 text-white px-3 py-2 rounded-lg text-center min-w-[60px]">
        <span className="text-xl font-bold">{timeLeft.seconds}</span>
        <p className="text-[10px] text-slate-400 uppercase">Secs</p>
      </div>
    </div>
  );
}

function EnrollmentModal({ 
  session, 
  isOpen, 
  onClose 
}: { 
  session: UpcomingSession; 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          courseName: session.title,
          coursePrice: session.isFree ? "Free" : `NPR ${session.price}`,
          batchName: session.batchName,
          sessionDate: session.sessionStartDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit enrollment");
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-800">Enroll Now</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Enrollment Submitted!</h4>
              <p className="text-slate-600 mb-4">
                We&apos;ve received your enrollment for <strong>{session.title}</strong>. We&apos;ll contact you soon with further details.
              </p>
              <button
                onClick={onClose}
                className="bg-[#C1121F] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#a50f1a] transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="bg-slate-50 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-slate-800 mb-1">{session.title}</h4>
                {session.batchName && (
                  <p className="text-sm text-slate-600">{session.batchName}</p>
                )}
                <p className="text-sm text-[#C1121F] font-medium mt-2">
                  Starts: {formatDate(session.sessionStartDate)}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  Price: {session.isFree ? <span className="text-green-600 font-semibold">FREE</span> : <span className="font-semibold">NPR {session.price?.toLocaleString()}</span>}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] outline-none"
                    placeholder="+977 98XXXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">School/Organization</label>
                  <input
                    type="text"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#C1121F]/20 focus:border-[#C1121F] outline-none"
                    placeholder="Your school or organization (optional)"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#C1121F] text-white py-3 rounded-xl font-medium hover:bg-[#a50f1a] transition-colors disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Enrollment"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function UpcomingSessionsClient({ sessions }: Props) {
  const [selectedSession, setSelectedSession] = useState<UpcomingSession | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  // Filter sessions based on tab
  // Priority: Use sessionStatus if available, otherwise use dates
  const now = new Date();
  const upcomingSessions = sessions.filter(session => {
    if (session.sessionStatus) {
      // Use explicit status if set
      return session.sessionStatus === 'upcoming' || session.sessionStatus === 'ongoing';
    }
    // Fallback to date-based filtering
    return new Date(session.sessionStartDate) >= now;
  });
  
  const completedSessions = sessions.filter(session => {
    if (session.sessionStatus) {
      // Use explicit status if set
      return session.sessionStatus === 'completed';
    }
    // Fallback to date-based filtering
    return new Date(session.sessionEndDate || session.sessionStartDate) < now;
  });

  const displayedSessions = activeTab === 'upcoming' ? upcomingSessions : completedSessions;

  if (sessions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">No Upcoming Sessions</h2>
        <p className="text-slate-600 mb-8">
          We&apos;re currently planning new sessions. Check back soon or browse our available courses.
        </p>
        <Link
          href="/services/courses"
          className="inline-flex items-center gap-2 bg-[#C1121F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a50f1a] transition-colors"
        >
          View All Courses
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-slate-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-8 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-white text-[#C1121F] shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Upcoming
              {upcomingSessions.length > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'upcoming' ? 'bg-[#C1121F] text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {upcomingSessions.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-8 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                activeTab === 'completed'
                  ? 'bg-white text-[#C1121F] shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Completed
              {completedSessions.length > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === 'completed' ? 'bg-[#C1121F] text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {completedSessions.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {displayedSessions.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              No {activeTab === 'upcoming' ? 'Upcoming' : 'Completed'} Sessions
            </h2>
            <p className="text-slate-600 mb-8">
              {activeTab === 'upcoming' 
                ? "We're currently planning new sessions. Check back soon or browse our available courses."
                : "No completed sessions to display yet."}
            </p>
            <Link
              href="/services/courses"
              className="inline-flex items-center gap-2 bg-[#C1121F] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#a50f1a] transition-colors"
            >
              View All Courses
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <>
        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-gradient-to-br from-[#C1121F] to-[#a50f1a] rounded-xl p-6 text-white">
            <p className="text-3xl font-bold">{displayedSessions.length}</p>
            <p className="text-white/80 text-sm">{activeTab === 'upcoming' ? 'Upcoming' : 'Completed'} Sessions</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
            <p className="text-3xl font-bold">{displayedSessions.filter(s => s.isFree).length}</p>
            <p className="text-white/80 text-sm">Free Sessions</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <p className="text-3xl font-bold">
              {displayedSessions.filter(s => s.deliveryMode === "Online").length}
            </p>
            <p className="text-white/80 text-sm">Online Sessions</p>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-6">
          {displayedSessions.map((session) => {
            const seatsAvailable = session.maxSeats 
              ? session.maxSeats - (session.currentEnrollments || 0) 
              : null;
            const isAlmostFull = seatsAvailable !== null && seatsAvailable <= 5;
            const isFull = seatsAvailable !== null && seatsAvailable <= 0;
            const deadlinePassed = session.enrollmentDeadline ? new Date(session.enrollmentDeadline) < new Date() : false;

            return (
              <div
                key={session._id}
                className={`bg-white rounded-2xl border-2 overflow-hidden shadow-lg transition-all hover:shadow-xl ${
                  isFull || deadlinePassed ? "border-slate-200 opacity-75" : "border-slate-100"
                }`}
              >
                <div className="md:flex">
                  {/* Left Section - Date */}
                  <div className="bg-gradient-to-br from-[#020617] to-slate-800 text-white p-6 md:w-48 flex flex-col items-center justify-center">
                    <p className="text-sm text-slate-400 uppercase tracking-wider">
                      {new Date(session.sessionStartDate).toLocaleDateString("en-US", { month: "short" })}
                    </p>
                    <p className="text-5xl font-bold">
                      {new Date(session.sessionStartDate).getDate()}
                    </p>
                    <p className="text-sm text-slate-400">
                      {new Date(session.sessionStartDate).toLocaleDateString("en-US", { weekday: "short" })}
                    </p>
                    <div className="mt-3 text-sm bg-white/10 px-3 py-1 rounded-full">
                      {formatTime(session.sessionStartDate)}
                    </div>
                  </div>

                  {/* Middle Section - Details */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {session.batchName && (
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">
                          {session.batchName}
                        </span>
                      )}
                      {session.sessionStatus === 'ongoing' && (
                        <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                          ONGOING
                        </span>
                      )}
                      {session.isFree ? (
                        <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                          FREE
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium">
                          NPR {session.price?.toLocaleString()}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        session.deliveryMode === "Online" 
                          ? "bg-blue-100 text-blue-700"
                          : session.deliveryMode === "In-Person"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}>
                        {session.deliveryMode}
                      </span>
                      {session.level && (
                        <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full capitalize">
                          {session.level}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 mb-2">{session.title}</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-slate-600 mb-4">
                      {session.duration && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {session.duration}
                        </div>
                      )}
                      {session.hours && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          {session.hours} Hours
                        </div>
                      )}
                      {session.sessionVenue && (
                        <div className="flex items-center gap-2 col-span-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {session.sessionVenue}
                        </div>
                      )}
                    </div>

                    {/* Countdown - Only for upcoming sessions */}
                    {activeTab === 'upcoming' && (
                      <div className="mb-4">
                        {session.sessionStatus === 'ongoing' ? (
                          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-red-700 font-semibold text-sm">Session In Progress</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Starts In</p>
                            <CountdownTimer targetDate={session.sessionStartDate} />
                          </>
                        )}
                      </div>
                    )}

                    {/* Completed badge for completed sessions */}
                    {activeTab === 'completed' && (
                      <div className="mb-4">
                        <span className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-medium">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Session Completed
                        </span>
                      </div>
                    )}

                    {/* Seats Info */}
                    {seatsAvailable !== null && (
                      <div className={`text-sm font-medium ${
                        isFull ? "text-red-600" : isAlmostFull ? "text-amber-600" : "text-green-600"
                      }`}>
                        {isFull ? (
                          "❌ Session Full"
                        ) : isAlmostFull ? (
                          `⚠️ Only ${seatsAvailable} seats left!`
                        ) : (
                          `✅ ${seatsAvailable} seats available`
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Section - Actions */}
                  <div className="p-6 md:w-56 flex flex-col justify-center gap-3 bg-slate-50">
                    {activeTab === 'upcoming' ? (
                      <>
                        {session.enrollmentDeadline && (
                          <div className="text-center mb-2">
                            <p className="text-xs text-slate-500">Enrollment Deadline</p>
                            <p className={`text-sm font-medium ${deadlinePassed ? "text-red-600" : "text-slate-700"}`}>
                              {new Date(session.enrollmentDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            </p>
                          </div>
                        )}

                        <button
                          onClick={() => setSelectedSession(session)}
                          disabled={isFull || deadlinePassed}
                          className={`w-full py-3 rounded-xl font-medium transition-all ${
                            isFull || deadlinePassed
                              ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                              : "bg-[#C1121F] text-white hover:bg-[#a50f1a] hover:shadow-lg"
                          }`}
                        >
                          {isFull ? "Session Full" : deadlinePassed ? "Deadline Passed" : "Enroll Now"}
                        </button>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-sm font-medium text-slate-600">Session Completed</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {new Date(session.sessionEndDate || session.sessionStartDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                    )}

                    {session.pdfUrl && (
                      <a
                        href={session.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 py-3 border-2 border-slate-200 rounded-xl text-slate-700 font-medium hover:border-[#C1121F] hover:text-[#C1121F] transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Course PDF
                      </a>
                    )}

                    {(session.deliveryMode === "Online" || session.deliveryMode === "Blended") && session.meetingUrl && (
                      <CopyMeetingButton url={session.meetingUrl} />
                    )}

                    <Link
                      href="/services/courses"
                      className="w-full flex items-center justify-center gap-2 py-3 text-slate-600 hover:text-[#C1121F] transition-colors text-sm"
                    >
                      View All Courses
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Section - Only for upcoming tab */}
        {activeTab === 'upcoming' && (
          <div className="mt-16 bg-gradient-to-r from-[#020617] via-slate-800 to-[#020617] rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Can&apos;t Find a Suitable Session?
            </h3>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              We offer customized training sessions for schools and organizations. Contact us to schedule a session that fits your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 bg-[#C1121F] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#a50f1a] transition-colors"
              >
                Contact Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link
                href="/services/courses"
                className="inline-flex items-center justify-center gap-2 bg-white/10 text-white px-8 py-3 rounded-xl font-medium hover:bg-white/20 transition-colors"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        )}
          </>
        )}
      </div>

      {/* Enrollment Modal */}
      {selectedSession && (
        <EnrollmentModal
          session={selectedSession}
          isOpen={!!selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}
    </>
  );
}
