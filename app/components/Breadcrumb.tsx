'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  const pathSegments = pathname.split('/').filter((segment) => segment !== '');

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="absolute top-[105px] left-0 w-full z-[10] px-4 md:px-8 pointer-events-none"
    >
      <div className="max-w-7xl mx-auto flex items-center space-x-2 text-[9px] font-bold tracking-widest uppercase text-white/50">
        <Link 
          href="/" 
          className="hover:text-white transition-colors flex items-center pointer-events-auto"
        >
          HOME
        </Link>
        
        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
          const isLast = index === pathSegments.length - 1;
          const label = segment.replace(/-/g, ' ');

          return (
            <div key={href} className="flex items-center space-x-2">
              <span className="text-white/20">/</span>
              {isLast ? (
                <span className="text-white select-none">{label}</span>
              ) : (
                <Link 
                  href={href} 
                  className="hover:text-white transition-colors pointer-events-auto"
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
