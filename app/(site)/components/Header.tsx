"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/partners", label: "About Us" },
  { href: "/teams", label: "Teams" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/image", label: "Images" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

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

  // Don't show header in Sanity Studio
  if (pathname?.startsWith("/studio")) return null;

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
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-medium text-[#020617] transition-colors hover:bg-slate-100 hover:text-[#C1121F]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <Link
            href="/contact"
            className="hidden shrink-0 rounded-full bg-[#C1121F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#A30F19] md:inline-flex shadow-sm hover:shadow-md hover:shadow-red-900/20"
          >
            info@nepatronix.com
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
              <li key={link.href} className="w-full">
                <Link
                  href={link.href}
                  className="block w-full rounded-xl px-4 py-3 text-center text-sm font-medium text-[#020617] transition-all duration-200 hover:bg-[#C1121F] hover:text-white"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="w-full">
              <Link
                href="/contact"
                className="mt-2 block w-full rounded-full bg-[#020617] px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-[#C1121F]"
                onClick={() => setIsOpen(false)}
              >
                info@nepatronix.com
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    </>
  );
}
