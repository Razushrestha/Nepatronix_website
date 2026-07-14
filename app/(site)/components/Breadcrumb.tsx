'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SITE_URL = 'https://nepatronix.org';

/**
 * Maps URL path segments to their proper human-readable display names.
 * This ensures breadcrumbs show accurate labels (e.g. "Partners & About Us")
 * rather than raw slug text (e.g. "Partners").
 */
const LABEL_MAP: Record<string, string> = {
  services: 'Services',
  blog: 'Blog & Insights',
  partners: 'Partners & About Us',
  teams: 'Our Team',
  contact: 'Contact Us',
  courses: 'Courses',
  'apply-certificate': 'Apply for Certificate',
  'upcoming-sessions': 'Upcoming Sessions',
  'verify-certificate': 'Verify Certificate',
  'image': 'Gallery',
};

/** Converts a URL segment to a readable label using the map or smart formatting. */
function formatLabel(segment: string): string {
  if (LABEL_MAP[segment]) return LABEL_MAP[segment];
  let raw = segment.replace(/-/g, ' ');
  try {
    raw = decodeURIComponent(raw);
  } catch {
    // keep segment as-is if it contains invalid % sequences
  }
  return raw
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Pages/prefixes that use a LIGHT background — breadcrumb text must be dark.
 * Everything else defaults to white text (dark hero sections).
 */
const LIGHT_BG_PREFIXES = [
  '/services/',
  '/verify-certificate',
  '/image',
];

export default function Breadcrumb() {
  const pathname = usePathname() ?? '/';
  const pathSegments = pathname.split('/').filter(Boolean);

  // No breadcrumb on the homepage
  if (pathSegments.length === 0) return null;

  const isLightBg = LIGHT_BG_PREFIXES.some((prefix) => pathname.startsWith(prefix));
  const textColor = isLightBg ? 'text-slate-400' : 'text-white/60';
  const lastColor = isLightBg ? 'text-slate-800 font-semibold' : 'text-white font-semibold';
  const sepColor = isLightBg ? 'text-slate-300' : 'text-white/25';
  const hoverColor = isLightBg ? 'hover:text-[#C1121F]' : 'hover:text-[#C1121F]';

  // Build breadcrumb trail items for JSON-LD structured data
  const breadcrumbItems = [
    { name: 'Home', item: SITE_URL },
    ...pathSegments.map((segment, index) => ({
      name: formatLabel(segment),
      item: `${SITE_URL}/${pathSegments.slice(0, index + 1).join('/')}`,
    })),
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: crumb.item,
    })),
  };

  return (
    <>
      {/* Schema.org BreadcrumbList — enables Google breadcrumb rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="absolute top-[105px] left-0 w-full z-10 px-6 pointer-events-none"
      >
        <ol
          className={`max-w-7xl mx-auto flex items-center flex-wrap gap-y-1 gap-x-0 text-[10px] sm:text-[11px] font-bold tracking-[0.2em] uppercase ${textColor}`}
        >
          {/* Home item */}
          <li>
            <Link
              href="/"
              aria-label="Home"
              className={`${hoverColor} transition-colors duration-200 flex items-center gap-1.5 pointer-events-auto`}
            >
              <svg
                className="w-3 h-3 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              HOME
            </Link>
          </li>

          {pathSegments.map((segment, index) => {
            const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
            const isLast = index === pathSegments.length - 1;
            const label = formatLabel(segment);

            return (
              <li key={href} className="flex items-center gap-3">
                {/* Separator — hidden from screen readers */}
                <span className={`${sepColor} text-sm font-light`} aria-hidden="true">
                  /
                </span>

                {isLast ? (
                  /* Current page — not a link, marked for assistive tech */
                  <span className={`${lastColor} select-none`} aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link
                    href={href}
                    className={`${hoverColor} transition-colors duration-200 pointer-events-auto`}
                  >
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
