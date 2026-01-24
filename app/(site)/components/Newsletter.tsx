'use client';

import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
      } else {
        throw new Error('Already subscribed or error occurred');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="relative overflow-hidden bg-[#0A0F1D] rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/5">
      {/* Background Decorative Envelope Icon */}
      <div className="absolute -right-5 top-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
        <svg 
          width="240" 
          height="180" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="white" 
          strokeWidth="1" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      </div>

      <div className="relative z-10">
        <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Subscribe to our newsletter
        </h3>
        <p className="text-slate-400 text-base md:text-lg mb-8 max-w-md leading-relaxed">
          Get the latest insights delivered weekly.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#161B2E] border border-white/5 rounded-2xl px-6 py-4 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#C1121F] transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={status === 'loading'}
            className="bg-[#C1121F] hover:bg-red-700 text-white font-bold px-10 py-4 rounded-2xl transition-all shadow-lg shadow-red-900/20 active:scale-95 disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Join'}
          </button>
        </form>

        {status === 'success' && (
          <p className="mt-4 text-green-400 text-sm font-medium">✨ You’re in! Welcome to the loop.</p>
        )}
        {status === 'error' && (
          <p className="mt-4 text-red-400 text-sm font-medium">Something went wrong. Please try again.</p>
        )}
      </div>
    </div>
  );
}
