"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/partners", label: "About Us" },
  { href: "/teams", label: "Teams" },
  { href: "/services", label: "Services", hasDropdown: true },
  { href: "/blog", label: "Blog" },
  { href: "/image", label: "Images" },
  { href: "/contact", label: "Contact" },
];

const servicesDropdown = [
  { href: "/services", label: "All Services" },
  { href: "/services/stem-education", label: "STEM Education" },
  { href: "/services/stem-lab-setup", label: "STEM Lab Setup" },
  { href: "/services/institutional-programs", label: "Government & CSR" },
  { href: "/services/courses", label: "Courses" },
  { href: "/services/apply-certificate", label: "Apply Certificate" },
  { href: "/services/upcoming-sessions", label: "Upcoming Sessions" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
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

  // Close dropdown when clicking outside
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

  return (
    <>
      {/* Backdrop for mobile menu - handles click outside */}
      <div 
        className={`fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <header
        className={`fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4 transition-transform duration-300 ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div className="relative z-50 flex w-full max-w-4xl items-center justify-between gap-4 rounded-full bg-white px-3 py-2 shadow-lg shadow-black/5 ring-1 ring-black/5">
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center pl-2">
            <Image
              src="/logo.png"
              alt="Nepatronix"
              width={40}
              height={40}
              priority
              className="h-10 w-10 rounded-full"
            />
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div key={link.href} className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-[#020617] transition-colors hover:bg-slate-100 hover:text-[#C1121F]"
                  >
                    {link.label}
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  <div 
                    className={`absolute top-full left-0 mt-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black/5 transition-all duration-200 ${
                      servicesOpen 
                        ? 'visible opacity-100 translate-y-0' 
                        : 'invisible opacity-0 -translate-y-2'
                    }`}
                  >
                    <div className="p-2">
                      {servicesDropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#020617] transition-colors hover:bg-[#C1121F] hover:text-white"
                          onClick={() => setServicesOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-[#020617] transition-colors hover:bg-slate-100 hover:text-[#C1121F]"
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/contact"
            className="hidden shrink-0 rounded-full bg-[#C1121F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A30F19] md:inline-flex shadow-sm hover:shadow-md hover:shadow-red-900/20"
          >
            info@nepatronix.org
          </Link>
          
          {/* Mobile toggle */}
          <button
            className="inline-flex items-center justify-center rounded-full bg-[#020617] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#C1121F] md:hidden"
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {isOpen ? "Close" : "Menu"}
          </button>
        </div>

        {/* Mobile dropdown */}
        <nav
          id="mobile-nav"
          className={`absolute left-4 right-4 top-20 z-40 origin-top rounded-2xl bg-white p-4 shadow-xl ring-1 ring-black/5 transition-all duration-300 ease-in-out md:hidden ${
            isOpen 
              ? "visible translate-y-0 opacity-100 scale-100" 
              : "invisible -translate-y-4 opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <ul className="space-y-2 flex flex-col items-center">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <li key={link.href} className="w-full">
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-[#020617] transition-all duration-200 hover:bg-slate-100"
                  >
                    {link.label}
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${mobileServicesOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Mobile Services Dropdown */}
                  <div className={`overflow-hidden transition-all duration-300 ${mobileServicesOpen ? 'max-h-[28rem] mt-2' : 'max-h-0'}`}>
                    <div className="bg-slate-50 rounded-xl p-2 space-y-1">
                      {servicesDropdown.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block rounded-lg px-4 py-2.5 text-sm font-medium text-[#020617] transition-colors hover:bg-[#C1121F] hover:text-white text-center"
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
                <li key={link.href} className="w-full">
                  <Link
                    href={link.href}
                    className="block w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-[#020617] transition-all duration-200 hover:bg-[#C1121F] hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              )
            ))}
            <li className="w-full">
              <Link
                href="/contact"
                className="mt-2 block w-full rounded-full bg-[#020617] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#C1121F]"
                onClick={() => setIsOpen(false)}
              >
                info@nepatronix.org
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
