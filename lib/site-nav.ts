export type SiteNavLink = {
  href: string;
  label: string;
  hasDropdown?: boolean;
};

/** Top-level header navigation links. */
export const MAIN_NAV_LINKS: SiteNavLink[] = [
  { href: "/", label: "Home" },
  { href: "/partners", label: "About Us" },
  { href: "/teams", label: "Teams" },
  { href: "/services", label: "Services", hasDropdown: true },
  { href: "/blog", label: "Blog" },
  { href: "/image", label: "Images" },
  { href: "/contact", label: "Contact" },
];

/** Services dropdown items from the header. */
export const SERVICES_NAV_LINKS: SiteNavLink[] = [
  { href: "/services", label: "All Services" },
  { href: "/services/stem-education", label: "STEM Education" },
  { href: "/services/stem-lab-setup", label: "STEM Lab Setup" },
  { href: "/services/institutional-programs", label: "Government & CSR" },
  { href: "/services/courses", label: "Courses" },
  { href: "/services/apply-certificate", label: "Apply Certificate" },
  { href: "/services/upcoming-sessions", label: "Upcoming Sessions" },
];

/** Flat list of every link shown in the header (for footer quick links, sitemap helpers, etc.). */
export function getFooterQuickLinks(): { href: string; label: string }[] {
  const links: { href: string; label: string }[] = [];

  for (const link of MAIN_NAV_LINKS) {
    if (link.hasDropdown) {
      links.push(...SERVICES_NAV_LINKS);
    } else {
      links.push({ href: link.href, label: link.label });
    }
  }

  return links;
}
