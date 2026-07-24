"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { MAIN_NAV_LINKS, SERVICES_NAV_LINKS } from "@/lib/site-nav";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 8);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Don't show header in the admin dashboard
  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  const isServicesActive = SERVICES_NAV_LINKS.some((s) => isActive(s.href));

  return (
    <>
      {/* Backdrop for mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white transition-all duration-300 ${
          scrolled ? "shadow-sm border-b border-slate-200/80" : "border-b border-transparent"
        } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          {/* Logo — square brand mark with wordmark baked in. Rendered a bit
              taller than the nav bar (h-24 in an h-20 bar) via absolute
              positioning so the atom + "NepaTronix" text feel prominent, while
              the transparent padding in the source PNG overhangs harmlessly. */}
          <Link
            href="/"
            aria-label="Nepatronix home"
            className="relative flex h-full shrink-0 items-center"
          >
            <Image
              src="/logo.png"
              alt="Nepatronix — Excellence Through Innovation"
              width={500}
              height={500}
              priority
              className="pointer-events-none h-[128px] w-auto translate-y-2 sm:h-[152px] sm:translate-y-3"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {MAIN_NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setServicesOpen((v) => !v)}
                    className={`relative flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${
                      isServicesActive || servicesOpen
                        ? "text-[#C1121F]"
                        : "text-[#020617] hover:text-[#C1121F]"
                    }`}
                  >
                    {link.label}
                    <svg
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        servicesOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    <span
                      className={`pointer-events-none absolute -bottom-[1px] left-3 right-3 h-[2px] rounded-full bg-[#C1121F] transition-all duration-300 ${
                        isServicesActive || servicesOpen ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
                      }`}
                      aria-hidden
                    />
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute top-full left-0 mt-3 w-56 rounded-xl bg-white p-2 shadow-xl ring-1 ring-black/5 transition-all duration-200 ${
                      servicesOpen
                        ? "visible opacity-100 translate-y-0"
                        : "invisible opacity-0 -translate-y-2"
                    }`}
                  >
                    {SERVICES_NAV_LINKS.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-[#C1121F]/5 text-[#C1121F]"
                            : "text-[#020617] hover:bg-slate-50 hover:text-[#C1121F]"
                        }`}
                        onClick={() => setServicesOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative px-4 py-2 text-sm font-medium transition-colors ${
                    isActive(link.href) ? "text-[#C1121F]" : "text-[#020617] hover:text-[#C1121F]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`pointer-events-none absolute -bottom-[1px] left-3 right-3 h-[2px] rounded-full bg-[#C1121F] transition-all duration-300 origin-center ${
                      isActive(link.href)
                        ? "opacity-100 scale-x-100"
                        : "opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100"
                    }`}
                    aria-hidden
                  />
                </Link>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-[#C1121F] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#A30F19] hover:shadow-md hover:shadow-red-900/10"
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              info@nepatronix.org
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-[#020617] transition-colors hover:bg-slate-100 md:hidden"
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
          >
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {isOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <>
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        <nav
          id="mobile-nav"
          className={`absolute inset-x-0 top-full origin-top overflow-hidden border-b border-slate-200 bg-white shadow-lg transition-all duration-300 md:hidden ${
            isOpen
              ? "visible opacity-100 translate-y-0"
              : "invisible opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {MAIN_NAV_LINKS.map((link) =>
              link.hasDropdown ? (
                <li key={link.href}>
                  <button
                    onClick={() => setMobileServicesOpen((v) => !v)}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isServicesActive
                        ? "bg-[#C1121F]/5 text-[#C1121F]"
                        : "text-[#020617] hover:bg-slate-50"
                    }`}
                  >
                    <span>{link.label}</span>
                    <svg
                      className={`h-4 w-4 transition-transform duration-200 ${
                        mobileServicesOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      mobileServicesOpen ? "max-h-[28rem] mt-1" : "max-h-0"
                    }`}
                  >
                    <div className="border-l-2 border-slate-100 ml-4 pl-3 py-1 space-y-1">
                      {SERVICES_NAV_LINKS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive(item.href)
                              ? "text-[#C1121F] font-medium"
                              : "text-slate-600 hover:text-[#C1121F]"
                          }`}
                          onClick={() => {
                            setIsOpen(false);
                            setMobileServicesOpen(false);
                          }}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </li>
              ) : (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-[#C1121F]/5 text-[#C1121F]"
                        : "text-[#020617] hover:bg-slate-50"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            )}
            <li className="pt-2">
              <Link
                href="/contact"
                className="block rounded-md bg-[#C1121F] px-4 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-[#A30F19]"
                onClick={() => setIsOpen(false)}
              >
                info@nepatronix.org
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      {/* Spacer so page content doesn't hide under the fixed header */}
      <div aria-hidden className="h-20" />
    </>
  );
}
