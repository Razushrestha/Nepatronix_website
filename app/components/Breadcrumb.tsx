'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();

  const pathSegments = pathname.split('/').filter((segment) => segment !== '');
  
  // Specific styling for pages with light backgrounds
  const isServiceDetail = pathname.startsWith('/services/');
  const textColor = isServiceDetail ? 'text-slate-500' : 'text-white/60';
  const lastColor = isServiceDetail ? 'text-slate-900' : 'text-white';
  const sepColor = isServiceDetail ? 'text-slate-300' : 'text-white/20';

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="absolute top-[105px] left-0 w-full z-[10] px-6 pointer-events-none"
    >
      <div className={`max-w-7xl mx-auto flex items-center space-x-3 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase ${textColor}`}>
        <Link 
          href="/" 
          className="hover:text-red-500 transition-all flex items-center gap-1.5 pointer-events-auto"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          HOME
        </Link>
        
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          
          // Format label: replace hyphens, decode, and capitalize words
          const rawLabel = decodeURIComponent(segment.replace(/-/g, ' '));
          const label = rawLabel.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
          ).join(' ');

          return (
            <div key={href} className="flex items-center space-x-3">
              <span className={`${sepColor} text-sm font-light`}>/</span>
              {isLast ? (
                <span className={`${lastColor} select-none`}>{label}</span>
              ) : (
                <Link 
                  href={href} 
                  className="hover:text-red-500 transition-all pointer-events-auto"
                >
                  {label}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
